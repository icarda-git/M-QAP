import { HttpService, Injectable } from '@nestjs/common';
import { keep } from '@tensorflow/tfjs';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiService } from 'src/doi/doi.service';
import { FormatSearvice } from './formater.service';
import * as schema from './schema.json';
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

  async getInfoByHandle(handle) {
      const results = await Promise.all([
        this.getDpsace(handle),
        this.getAltmetricByHandle(handle),
      ]);
      let data = results[0];

      if (data.Affiliation)
        data.Affiliation = await this.toClarisa(data.Affiliation, handle);

      if (data['Funding source'])
        data['Funding source'] = await this.toClarisa(
          data['Funding source'],
          handle,
        );

      data['handle_altmetric'] = results[1];

      let DOI_INFO = null;
      if (data.DOI) {
        let doi = this.doi.isDOI(data.DOI);
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
          description: 'The knowledge product is described by rich metadata',
          valid:
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
          description: 'Metadata contains AGROVOC keywords',
          valid: data?.agrovoc_keywords
            ? data.agrovoc_keywords.keywords.length > 0
            : false,
        },
        {
          name: 'I1',
          description:
            'Metadata include qualified references to other (meta)data',
          valid: data
            ? data.hasOwnProperty('DOI_Info') ||
              data.hasOwnProperty('Reference to other DOI or Handle')
            : false,
        },
      ],
      R: [
        {
          name: 'R1',
          description:
            'Data asset is Open Access (OA) and has a clear and accessible usage license',
          valid: data
            ? data?.DOI_Info?.is_oa == 'yes' ||
              data['Open Access'] == 'Open Access'
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
      orcid = orcid.split(': ')[1];
      tohit.push(
        this.http
          .get(`https://orcid.org/${orcid}`, {
            headers: { Accept: 'application/json' },
          })
          .pipe(map((d) => d.data))
          .toPromise()
          .catch((e) => null),
      );
    });
    return await (await Promise.all(tohit)).filter((d) => d);
  }

  async getDpsace(handle) {
    let data = await this.http
      .get(
        `https://cgspace.cgiar.org/rest/handle/${handle}?expand=metadata,parentCommunityList,parentCollectionList,bitstreams`,
      )
      .pipe(map((d) => d.data))
      .toPromise();

    let formated_data = this.formatService.format(data, schema);

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
