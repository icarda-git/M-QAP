import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { keep } from '@tensorflow/tfjs';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiService } from 'src/doi/doi.service';
import { FormatSearvice } from './formater.service';
import * as schemas from './schema.json';
import * as licences from './licences.json';
import xlsx from 'node-xlsx';
import { HttpService } from '@nestjs/axios';
import fs from 'fs';
const https = require('https');
@Injectable()
export class HandleService {
  Commodities;
  ClarisaRegons;
  private readonly logger = new Logger(HandleService.name);
  constructor(
    private http: HttpService,
    private formatService: FormatSearvice,
    private doi: DoiService,
    private ai: AI,
  ) {
    this.initCommodities();
    this.initRegions();
  }
  async initCommodities() {
    const workSheetsFromFile = await xlsx.parse(
      `${process.cwd()+'/assets'}/Commodities.xlsx`,
    );
    this.Commodities = {};
    workSheetsFromFile[0].data.forEach((d: any, i) => {
      if (i > 0)
        this.Commodities[d[0]] = d
          .map((d: string) => d.toLocaleLowerCase().split(', '))
          .flat();
    });
    this.logger.log('Commodities data Loaded');
  }
  async initRegions() {
    const workSheetsFromFile = await xlsx.parse(`${process.cwd()+'/assets'}/CLARISA_UN.xlsx`);
    this.ClarisaRegons = {};
    workSheetsFromFile[0].data.forEach((d: any, i) => {
      if (i > 0) this.ClarisaRegons[d[1].toLocaleLowerCase()] = d[0];
    });
    this.logger.log('ClarisaRegons data Loaded');
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

  getInfobyScheam(schemas, prefix) {
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
          const splited = d.request.res.responseUrl.split('/');
          return splited[splited.length - 1];
        }),
      )
      .toPromise()
      .catch((e) => {
        console.log(e);
        return false;
      });

    let data = await this.http
      .get(`${link}/api/3/action/package_show?id=${id}`)
      .pipe(map((d) => d.data.result))
      .toPromise()
      .catch((e) => {
        console.log(e);
        return false;
      });

    if (data) {
      let formated_data = this.formatService.format(
        this.flatData(data, null, null, { organization: 'title' }),
        schema,
      );
      formated_data = this.addOn(formated_data, schema);

      formated_data['repo'] = repo;
      return formated_data;
    }
  }

  async getDataverse(handle, schema, repo, link, link_type) {
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
        console.log(e);
        return false;
      });
    if (data) {
      let formated_data = this.formatService.format(
        this.flatData(data, 'typeName', 'value'),
        schema,
      );

      formated_data = this.addOn(formated_data, schema);

      formated_data['repo'] = repo;
      return formated_data;
    }
  }

  getCommodities(keywords) {
    // Or var xlsx = require('node-xlsx').default;
    const finalCom = [];
    // Parse a file
    if (!Array.isArray(keywords)) keywords = [keywords];

    keywords.forEach((keyword) => {
      const foundindex = Object.values(this.Commodities).findIndex(
        (d: [string]) => {
          return d.indexOf(keyword.toLocaleLowerCase()) > -1;
        },
      );
      if (foundindex > -1)
        finalCom.push(Object.keys(this.Commodities)[foundindex]);
    });

    return [...new Set(finalCom)];
  }

  addOn(formated_data, schema) {
    let addons = schema.metadata.filter((d) => d.addon);

    addons.forEach((element) => {
      if (Object.keys(element.addon)[0] == 'combind')
        formated_data = this.comind(
          formated_data,
          element.value.value,
          element.addon.combind,
          schema,
        );

      if (Object.keys(element.addon)[0] == 'split') {
        formated_data[element.value.value] = formated_data[element.value.value]
          .split(element.addon.split)
          .map((d: string) => d.trim());
      }
    });

    return formated_data;
  }

  comind(data, src1, src2, schema) {
    if (Array.isArray(data[src1])) {
      data[src1] = data[src1].map((d, i) => {
        let obj = {};
        obj[d] = data[src2][i];
        return obj;
      });
      let formated = this.formatService.format(
        this.flatData(data[src1], '', ''),
        schema,
      );
      data = { ...data, ...formated };
      delete data[src1];
      delete data[src2];
    }
    return data;
  }

  flatData(data, akey = null, avalue = null, key_value = {}) {
    let keys = Object.keys(key_value);
    let values: any = Object.values(key_value);
    let metadata = [];
    // not as what i want
    let flat = (data, akey = null, avalue = null, key_value = {}) => {
      if (
        akey &&
        avalue &&
        data[akey] &&
        data.hasOwnProperty(akey) &&
        data.hasOwnProperty(avalue) &&
        data[avalue] &&
        !Array.isArray(data[avalue]) &&
        typeof data[avalue] !== 'object'
      )
        metadata.push({ key: data[akey], value: data[avalue] });
      else if (typeof data == 'object' && data)
        Object.keys(data).forEach((key) => {
          if (
            akey != key &&
            typeof data[key] !== 'object' &&
            !Array.isArray(data[key])
          )
            metadata.push({ key, value: data[key] });
          else if (Array.isArray(data[key]))
            data[key].forEach((element) => {
              flat(element, akey, avalue);
            });
          else if (keys.indexOf(key) == -1) flat(data[key], akey, avalue);
          else if (keys.indexOf(key) > -1) {
            metadata.push({
              key: keys[keys.indexOf(key)],
              value: data[key][values[keys.indexOf(key)]],
            });
          }
        });
    };
    flat(data, akey, avalue);
    return { metadata };
  }

  toClarisaRegions(regions) {
    let arrayofobjects = [];
    if (!Array.isArray(regions)) regions = [regions];
    regions.forEach((element) => {
      arrayofobjects.push({
        name: element,
        clarisa_id: this.ClarisaRegons[element.toLowerCase()],
      });
    });
    return arrayofobjects;
  }

  async getInfoByHandle(handle) {
    let { prefix, param, link_type } = this.IsDOIOrHandle(handle);
    if (!param) throw new BadRequestException('please provide valid handle');
    else handle = link_type == 'handle' ? param : param;

    let { schema, repo, link, type } = this.getInfobyScheam(schemas, prefix);

    let dataSurces =
      link_type == 'handle' ? [this.getAltmetricByHandle(handle)] : [];
    if (type == 'DSpace')
      dataSurces.push(this.getDpsace(handle, schema, repo, link));
    if (type == 'Dataverse')
      dataSurces.push(this.getDataverse(handle, schema, repo, link, link_type));
    if (type == 'CKAN')
      dataSurces.push(this.getCkan(handle, schema, repo, link, link_type));

    const results = await Promise.all(dataSurces);

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
      let newArrayOfcountries = [];
      const tobeChange = {
        Congo: 'Congo, Democratic Republic of',
      };
      const tobeDeleted = ['Democratic Republic Of'];
      if (!Array.isArray(data?.Countries)) data.Countries = [data.Countries];
      data?.Countries.forEach((element) => {
        if (Array.isArray(element) && element.length > 1)
          newArrayOfcountries.push(element.join(', '));
        else newArrayOfcountries.push(element);
      });
      const flatedAray = newArrayOfcountries.flat();
      newArrayOfcountries = [];
      flatedAray.forEach((element) => {
        if(tobeChange[element])
        newArrayOfcountries.push(tobeChange[element]);
        else if(tobeDeleted.indexOf(element) == -1)
        newArrayOfcountries.push(element)
      });
      data['Countries'] = newArrayOfcountries;
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

    data['FAIR'] = this.calclateFAIR(data);

    return data;
  }
  calclateFAIR(data) {
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
            licences.indexOf(data['Rights']) >= 0
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
    let tohit = [];
    orcids.forEach((orcid) => {
      const regex = /([A-Za-z0-9]{4}-){3}[A-Za-z0-9]{4}/gm;
      let match = regex.exec(orcid);
      if (match && match[0]) {
        orcid = match[0];
        tohit.push(
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
    if (tohit.length > 0)
      return await (await Promise.all(tohit)).filter((d) => d);
    else return [];
  }

  async getDpsace(handle, schema, repo, link) {
    let data = await this.http
      .get(`${link}/rest/handle/${handle}?expand=all`)
      .pipe(map((d) => d.data))
      .toPromise()
      .catch((e) => console.log(e));
    let formated_data = this.formatService.format(data, schema);
    formated_data['repo'] = repo;
    return formated_data;
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
