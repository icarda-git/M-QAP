import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiService } from 'src/doi/doi.service';
import { FormatService } from './formatter.service';
import * as schemas from './schema.json';
import * as licenses from './licenses.json';
import xlsx from 'node-xlsx';
import { HttpService } from '@nestjs/axios';
import { CommoditiesService } from 'src/commodities/commodities.service';
import { In } from 'typeorm';
const https = require('https');
@Injectable()
export class HandleService {
  Commodities;
  ClarisaRegions;
  private readonly logger = new Logger(HandleService.name);
  constructor(
    private http: HttpService,
    private formatService: FormatService,
    private commoditiesService: CommoditiesService,
    private doi: DoiService,
    private ai: AI,
  ) {
    this.initCommodities();
    this.initRegions();
  }
  async initCommodities() {
    const workSheetsFromFile = await xlsx.parse(
      `${process.cwd() + '/assets'}/Commodities.xlsx`,
    );
    this.Commodities = {};
    workSheetsFromFile[0].data.forEach((d: any, i) => {
      if (i > 0)
        this.Commodities[d[0]] = d
          .map((d: string) => d.toLocaleLowerCase().split(', '))
          .flat();
    });
    console.log(this.Commodities);
    this.logger.log('Commodities data Loaded');
  }
  async initRegions() {
    const workSheetsFromFile = await xlsx.parse(
      `${process.cwd() + '/assets'}/CLARISA_UN.xlsx`,
    );
    this.ClarisaRegions = {};
    workSheetsFromFile[0].data.forEach((d: any, i) => {
      if (i > 0) this.ClarisaRegions[d[1].toLocaleLowerCase()] = d[0];
    });
    this.logger.log('Clarisa Regions data Loaded');
  }
  async toClarisa(Items, handle) {
    if (!Array.isArray(Items)) Items = [Items];
    let result = [];
    for (let i in Items) {
      result.push({
        name: Items[i],
        prediction: await this.ai.makePrediction(Items[i], handle),
      });
    }
    return result;
  }

  IsDOIOrHandle(URL): any {
    //Replace %2F with /
    URL = URL.split('%2F');
    URL = URL.join('/');
    //Replace %3A with :
    URL = URL.split('%3A');
    URL = URL.join(':');

    //match the pattern of any part after a "\" or ":" as 2 digits followed by anything the a "/" followed by anything.
    //DOIs and Handles will follow this pattern, but it is not necessary all the matches are DOIs or Handles.
    const regex = /(?<=\/|\:|^)\d{2,}.*[^\/]\/[^\s]+/;
    let match = regex.exec(URL);

    if (match !== null) {
      let matchArray = match[0].split('/');
      let prefix = matchArray[0];
      let type = 'handle';
      if (/^10\..*/.exec(prefix)) {
        type = 'DOI';
      }
      return { prefix, param: match[0], link_type: type };
    }
    return false;
  }

  getInfoBySchema(schemas, prefix) {
    let repos = schemas.filter((d) => d.prefix.indexOf(prefix) != -1);
    if (repos.length == 0)
      throw new BadRequestException(
        'The handle provided is not supported by the M-QAP, as the repository is not included. Please get in touch with the PRMS technical support',
      );
    return repos[0];
  }
  async getCkan(handle, schema, repo, link, link_type) {
    let id = await this.http
      .get(`https://doi.org/${handle}`)
      .pipe(
        map((d) => {
          const splitted = d.request.res.responseUrl.split('/');
          return splitted[splitted.length - 1];
        }),
      )
      .toPromise()
      .catch((e) => {
        console.error(e);
        return false;
      });

    let data = await this.http
      .get(`${link}/api/3/action/package_show?id=${id}`)
      .pipe(map((d) => d.data.result))
      .toPromise()
      .catch((e) => {
        console.error(e);
        return false;
      });

    if (data) {
      let formatted_data = this.formatService.format(
        this.flatData(data, null, null, { organization: 'title' }),
        schema,
      );
      formatted_data = this.addOn(formatted_data, schema);

      formatted_data['repo'] = repo;
      return formatted_data;
    }
  }

  async getDataVerse(handle, schema, repo, link, link_type) {
    let data = await this.http
      .get(
        `${link}/api/datasets/:persistentId/?persistentId=${
          link_type == 'DOI' ? 'doi' : 'hdl'
        }:${handle}`,
        {
          headers: {
            Accept: 'application/json',
            cookie:
              'incap_ses_288_2801958=/N6gO8gj1g4/4pnW2C7/A9DVbGMAAAAAW5jDWMnTcDMG7GaTE79mDg==; visid_incap_2801958=moDP+bZVRZ6D2SJehPzbxs/VbGMAAAAAQUIPAAAAAACXoHcOizPhxog6dcc30XRK; JSESSIONID=124ddc7e698f28720098b66aa429',
            'User-Agent': 'CLARISA',
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      )
      .pipe(map((d) => d.data.data))
      .toPromise()
      .catch((e) => {
        console.error(e);
        return false;
      });
    if (data) {
      let formatted_data = this.formatService.format(
        this.flatData(data, 'typeName', 'value'),
        schema,
      );

      formatted_data = this.addOn(formatted_data, schema);

      formatted_data['repo'] = repo;
      return formatted_data;
    }
  }

  async getCommodities(keywords: string[]) {
    if (!Array.isArray(keywords)) keywords = [keywords];
    keywords = keywords.map((i) => i.toLowerCase());
    const q = this.commoditiesService.commoditiesRepository
      .createQueryBuilder('commodity')
      .where('LOWER(commodity.name)  IN(:keywords)', { keywords });
    console.log(q.getSql());
    const list = await q.getMany();
    console.log(list);
    return list.map((i) => i.name);
  }

  addOn(formatted_data, schema) {
    let addons = schema.metadata.filter((d) => d.addon);

    addons.forEach((element) => {
      if (Object.keys(element.addon)[0] == 'combind')
        formatted_data = this.comind(
          formatted_data,
          element.value.value,
          element.addon.combind,
          schema,
        );

      if (Object.keys(element.addon)[0] == 'split') {
        formatted_data[element.value.value] = formatted_data[
          element.value.value
        ]
          .split(element.addon.split)
          .map((d: string) => d.trim());
      }
    });

    return formatted_data;
  }

  comind(data, src1, src2, schema) {
    if (Array.isArray(data[src1])) {
      data[src1] = data[src1].map((d, i) => {
        let obj = {};
        obj[d] = data[src2][i];
        return obj;
      });
      let formatted = this.formatService.format(
        this.flatData(data[src1], '', ''),
        schema,
      );
      data = { ...data, ...formatted };
      delete data[src1];
      delete data[src2];
    }
    return data;
  }

  flatData(data, aKey = null, aValue = null, key_value = {}) {
    let keys = Object.keys(key_value);
    let values: any = Object.values(key_value);
    let metadata = [];
    // not as what i want
    let flat = (data, aKey = null, aValue = null, key_value = {}) => {
      if (
        aKey &&
        aValue &&
        data[aKey] &&
        data.hasOwnProperty(aKey) &&
        data.hasOwnProperty(aValue) &&
        data[aValue] &&
        !Array.isArray(data[aValue]) &&
        typeof data[aValue] !== 'object'
      )
        metadata.push({ key: data[aKey], value: data[aValue] });
      else if (typeof data == 'object' && data)
        Object.keys(data).forEach((key) => {
          if (
            aKey != key &&
            typeof data[key] !== 'object' &&
            !Array.isArray(data[key])
          )
            metadata.push({ key, value: data[key] });
          else if (Array.isArray(data[key]))
            data[key].forEach((element) => {
              flat(element, aKey, aValue);
            });
          else if (keys.indexOf(key) == -1) flat(data[key], aKey, aValue);
          else if (keys.indexOf(key) > -1) {
            metadata.push({
              key: keys[keys.indexOf(key)],
              value: data[key][values[keys.indexOf(key)]],
            });
          }
        });
    };
    flat(data, aKey, aValue);
    return { metadata };
  }

  toClarisaRegions(regions) {
    let arrayOfObjects = [];
    if (!Array.isArray(regions)) regions = [regions];
    regions.forEach((element) => {
      arrayOfObjects.push({
        name: element,
        clarisa_id: this.ClarisaRegions[element.toLowerCase()],
      });
    });
    return arrayOfObjects;
  }

  async getInfoByHandle(handle) {
    let { prefix, param, link_type } = this.IsDOIOrHandle(handle);
    if (!param) throw new BadRequestException('please provide valid handle');
    else handle = link_type == 'handle' ? param : param;

    let { schema, repo, link, type } = this.getInfoBySchema(schemas, prefix);

    let dataSources =
      link_type == 'handle' ? [this.getAltmetricByHandle(handle)] : [];
    if (type == 'DSpace')
      dataSources.push(this.getDpsace(handle, schema, repo, link));
    if (type == 'Dataverse')
      dataSources.push(
        this.getDataVerse(handle, schema, repo, link, link_type),
      );
    if (type == 'CKAN')
      dataSources.push(this.getCkan(handle, schema, repo, link, link_type));

    const results = await Promise.all(dataSources);

    let data = results.length > 1 ? results[1] : results[0];

    if (data?.Affiliation)
      data.Affiliation = await this.toClarisa(data.Affiliation, handle);

    if (data['Region of the research']) {
      data['Region of the research'] = this.toClarisaRegions(
        data['Region of the research'],
      );
    }

    if (!data['Region of the research'] && !data['Countries'])
      data['Geographic location'] = {
        name: 'Global',
        clarisa_id: 1,
      };

    if (data.hasOwnProperty('Funding source') && data['Funding source'])
      data['Funding source'] = await this.toClarisa(
        data['Funding source'],
        handle,
      );

    if (data?.Keywords) {
      if (!Array.isArray(data?.Keywords)) data.Keywords = [data.Keywords];
      data['agrovoc_keywords'] = await this.getAgrovocKeywords(data.Keywords);
      data['Commodities'] = await this.getCommodities(data.Keywords);
    }

    if (data?.Countries) {
      let newArrayOfCountries = [];
      const toBeChange = {
        Congo: 'Congo, Democratic Republic of',
      };
      const toBeDeleted = ['Democratic Republic Of'];
      if (!Array.isArray(data?.Countries)) data.Countries = [data.Countries];
      data?.Countries.forEach((element) => {
        if (Array.isArray(element) && element.length > 1)
          newArrayOfCountries.push(element.join(', '));
        else newArrayOfCountries.push(element);
      });
      const flattedArray = newArrayOfCountries.flat();
      newArrayOfCountries = [];
      flattedArray.forEach((element) => {
        if (toBeChange[element]) newArrayOfCountries.push(toBeChange[element]);
        else if (toBeDeleted.indexOf(element) == -1)
          newArrayOfCountries.push(element);
      });
      data['Countries'] = newArrayOfCountries;
    }

    if (results.length > 1) data['handle_altmetric'] = results[0];

    let DOI_INFO = null;
    if (data?.DOI || link_type == 'DOI') {
      let doi = this.doi.isDOI(link_type == 'DOI' ? handle : data.DOI);
      if (doi) {
        DOI_INFO = await this.doi.getInfoByDOI(doi);
        data['DOI_Info'] = DOI_INFO;
      }
    }

    if (data?.ORCID) data['ORCID_Data'] = await this.getORCID(data.ORCID);

    data['FAIR'] = this.calculateFAIR(data);

    return data;
  }
  calculateFAIR(data) {
    let FAIR = {
      score: {
        total: 0,
        F: 0,
        A: 0,
        I: 0,
        R: 0,
      },
      F: [
        {
          name: 'F1',
          description:
            'The knowledge product is retrievable through its handle',
          valid: true,
        },
        {
          name: 'F2',
          description:
            'The knowledge product is described by rich metadata such as title, authors, description/abstract, and issue date',
          valid:
            (data['Issued date'] ? true : false) &&
            (data.Title ? true : false) &&
            (data.Authors ? true : false) &&
            (data.Description ? true : false),
        },
        {
          name: 'F3',
          description: 'At least one author is linked through their ORCID',
          valid: data.ORCID_Data
            ? data.ORCID_Data && data.ORCID_Data.length > 0
            : false,
        },
      ],
      A: [
        {
          name: 'A1',
          description: 'Metadata are retrievable through the handle',
          valid: true,
        },
      ],
      I: [
        {
          name: 'I1',
          description: 'Metadata contain AGROVOC keywords',
          valid: data?.agrovoc_keywords
            ? data.agrovoc_keywords.keywords.length > 0
            : false,
        },
        {
          name: 'I2',
          description:
            'Metadata include qualified references to other (meta)data',
          valid: data
            ? data.hasOwnProperty('Reference to other knowledge products')
            : false,
        },
      ],
      R: [
        {
          name: 'R1',
          description:
            'The knowledge product is Open Access (OA) and has a clear and accessible usage license',
          valid:
            data['Open Access'] &&
            (data['Open Access'] as string)
              .toLocaleLowerCase()
              .includes('open access') &&
            licenses.indexOf(data['Rights']) >= 0
              ? true
              : false,
        },
      ],
    };
    Object.keys(FAIR.score).forEach((key) => {
      if (key != 'total')
        FAIR.score[key] =
          FAIR[key].filter((d) => d.valid).length / FAIR[key].length;
    });
    FAIR.score.total =
      Object.values(FAIR.score).reduce((partialSum, a) => partialSum + a, 0) /
      (Object.keys(FAIR.score).length - 1);
    Object.keys(FAIR.score).forEach((key) => {
      FAIR.score[key] = Number((FAIR.score[key] as number).toFixed(3));
    });

    return FAIR;
  }
  async getAgrovocKeywords(Keywords: [string]) {
    if (!Array.isArray(Keywords)) Keywords = [Keywords];
    let keywords_agro = [];
    Keywords.forEach((keyw) => {
      keywords_agro.push(
        this.http
          .get(
            `https://agrovoc.uniroma2.it/agrovoc/rest/v1/agrovoc/search?query=${keyw}`,
          )
          .pipe(
            map((d) => {
              return { keyword: keyw, is_agrovoc: d.data.results.length > 0 };
            }),
          )
          .toPromise()
          .catch((e) => {
            return { keyword: keyw, is_agrovoc: false };
          }),
      );
    });
    const results = await Promise.all(keywords_agro);
    return {
      keywords: results.filter((d) => d.is_agrovoc).map((d) => d.keyword),
      results,
    };
  }

  async getORCID(orcids) {
    if (!Array.isArray(orcids)) orcids = [orcids];
    let toHit = [];
    orcids.forEach((orcid) => {
      const regex = /([A-Za-z0-9]{4}-){3}[A-Za-z0-9]{4}/gm;
      let match = regex.exec(orcid);
      if (match && match[0]) {
        orcid = match[0];
        toHit.push(
          this.http
            .get(`https://orcid.org/${orcid}`, {
              headers: { Accept: 'application/json' },
            })
            .pipe(map((d) => d.data))
            .toPromise()
            .catch((e) => null),
        );
      }
    });
    if (toHit.length > 0)
      return await (await Promise.all(toHit)).filter((d) => d);
    else return [];
  }

  async getDpsace(handle, schema, repo, link) {
    let data = await this.http
      .get(`${link}/rest/handle/${handle}?expand=all`)
      .pipe(map((d) => d.data))
      .toPromise()
      .catch((e) => console.error(e));
    let formatted_data = this.formatService.format(data, schema);
    formatted_data['repo'] = repo;
    return formatted_data;
  }

  async getAltmetricByHandle(handle) {
    const link = `https://api.altmetric.com/v1/handle/${handle}`;
    const altmetric = await this.http
      .get(link)
      .pipe(
        map((d) => {
          if (d && d.status == 200) {
            return d.data;
          } else return null;
        }),
      )
      .toPromise()
      .catch(() => null);

    return altmetric;
  }
}
