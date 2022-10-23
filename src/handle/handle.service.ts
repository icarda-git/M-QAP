import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { keep } from '@tensorflow/tfjs';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiService } from 'src/doi/doi.service';
import { FormatSearvice } from './formater.service';
import * as schemas from './schema.json';
import * as licences from './licences.json';
@Injectable()
export class HandleService {
  constructor(
    private http: HttpService,
    private formatService: FormatSearvice,
    private doi: DoiService,
    private ai: AI,
  ) {}

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
        'handle provided is not supported by M-QAP the repo is not included pelase contact support',
      );
    return repos[0];
  }

  async getDataverse(handle, schema, repo, link, link_type) {
    let data = await this.http
      .get(
        `${link}/api/datasets/:persistentId/?persistentId=${
          link_type == 'DOI' ? 'doi' : 'hdl'
        }:${handle}`,
      )
      .pipe(map((d) => d.data.data))
      .toPromise()
      .catch((e) => {
        console.log(e);
        return false;
      });
    if (data) {
      console.log(data);
      let formated_data = this.formatService.format(
        this.flatData(data, 'typeName', 'value'),
        schema,
      );

      formated_data = this.addOn(formated_data, schema);

      formated_data['repo'] = repo;
      return formated_data;
    }
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

  flatData(data, akey, avalue) {
    let metadata = [];
    // not as what i want
    let flat = (data, akey, avalue) => {
      if (
        data[akey] &&
        data[avalue] &&
        !Array.isArray(data[avalue]) &&
        typeof data[avalue] !== 'object'
      )
        metadata.push({ key: data[akey], value: data[avalue] });
      else
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
          else flat(data[key], akey, avalue);
        });
    };
    flat(data, akey, avalue);
    return { metadata };
  }

  async getInfoByHandle(handle) {
    let { prefix, param, link_type } = this.IsDOIOrHandle(handle);
    if (!param) throw new BadRequestException('please provide valid handle');
    else handle = link_type == 'handle' ? param : param;

    let { schema, repo, link, type } = this.getInfobyScheam(schemas, prefix);

    let dataSurces = [this.getAltmetricByHandle(handle)];
    if (type == 'DSpace')
      dataSurces.push(this.getDpsace(handle, schema, repo, link));
    if (type == 'Dataverse')
      dataSurces.push(this.getDataverse(handle, schema, repo, link, link_type));

    const results = await Promise.all(dataSurces);

    let data = results[1];

    if (data.Affiliation)
      data.Affiliation = await this.toClarisa(data.Affiliation, handle);

    if (data['Funding source'])
      data['Funding source'] = await this.toClarisa(
        data['Funding source'],
        handle,
      );

    data['handle_altmetric'] = results[0];

    let DOI_INFO = null;
    if (data.DOI || link_type == 'DOI') {
      let doi = this.doi.isDOI(link_type == 'DOI'? handle : data.DOI);
      if (doi) {
        DOI_INFO = await this.doi.getInfoByDOI(doi);
        data['DOI_Info'] = DOI_INFO;
      }
    }

    if (data.ORCID) data['ORCID_Data'] = await this.getORCID(data.ORCID);

    if (data.Keywords)
      data['agrovoc_keywords'] = await this.getAgrovocKeywords(data.Keywords);

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
            (data['Publication Date'] ? true : false) &&
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
          name: 'I1',
          description:
            'Metadata include qualified references to other (meta)data',
          valid: data
            ? data.hasOwnProperty('Reference to other DOI or Handle')
            : false,
        },
      ],
      R: [
        {
          name: 'R1',
          description:
            'The knowledge product is Open Access (OA) and has a clear and accessible usage license',
          valid: data
            ? data?.DOI_Info?.is_oa == 'yes' ||
              (data['Open Access'] &&
                (data['Open Access'] as string)
                  .toLocaleLowerCase()
                  .includes('open access')) ||
              licences.indexOf(data['Rights']) >= 0
            : false,
        },
      ],
    };
    Object.keys(FAIR.score).forEach((key) => {
      if (key != 'total')
        FAIR.score[key] =
          (FAIR[key].filter((d) => d.valid).length / FAIR[key].length) * 100;
    });
    FAIR.score.total =
      Object.values(FAIR.score).reduce((partialSum, a) => partialSum + a, 0) /
      (Object.keys(FAIR.score).length - 1);
    Object.keys(FAIR.score).forEach((key) => {
      FAIR.score[key] = Number((FAIR.score[key] as number).toFixed(2));
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
      .get(
        `${link}/rest/handle/${handle}?expand=metadata,parentCommunityList,parentCollectionList,bitstreams`,
      )
      .pipe(map((d) => d.data))
      .toPromise().catch(e=>console.log(e));

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
