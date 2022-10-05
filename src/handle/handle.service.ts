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
    if (data.Keywords)
      data['agrovoc_keywords'] = await this.getAgrovocKeywords(data.Keywords);

    if (data.ORCID) data['ORCID_Data'] = await this.getORCID(data.ORCID);

    if (data.Affiliation)
      data.Affiliation = await this.toClarisa(data.Affiliation, handle);

    if (data['Funding source'])
      data['Funding source'] = await this.toClarisa(
        data['Funding source'],
        handle,
      );

    data['handle_altmetric'] = results[1];
    return data;
  }

  async getAgrovocKeywords(Keywords: [string]) {
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
          .toPromise(),
      );
    });
    const results = await Promise.all(keywords_agro);
    return {
      keywords: results.filter((d) => d.is_agrovoc).map((d) => d.keyword),
      results,
    };
  }

  async getORCID(orcids) {
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
    return await Promise.all(tohit);
  }

  async getDpsace(handle) {
    let data = await this.http
      .get(
        `https://cgspace.cgiar.org/rest/handle/${handle}?expand=metadata,parentCommunityList,parentCollectionList,bitstreams`,
      )
      .pipe(map((d) => d.data))
      .toPromise();

    let formated_data = this.formatService.format(data, schema);
    let DOI_INFO = null;
    if (formated_data.DOI) {
      let doi = this.doi.isDOI(formated_data.DOI);
      if (doi) {
        DOI_INFO = await this.doi.getInfoByDOI(doi);
        formated_data['DOI_Info'] = DOI_INFO;
      }
    }
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
