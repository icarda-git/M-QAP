import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { DoiService } from 'src/doi/doi.service';
import { FormatSearvice } from './formater.service';
import * as schema from './schema.json';
@Injectable()
export class HandleService {
  constructor(
    private http: HttpService,
    private formatService: FormatSearvice,
    private doi: DoiService,
  ) {}

  async getInfoByHandle(handle) {
    console.log('getInfoByHandle', handle);
    const results = await Promise.all([
      this.getDpsace(handle),
      this.getAltmetricByHandle(handle),
    ]);
    let data = results[0];
    data['handle_altmetric'] = results[1];
    return data;
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
