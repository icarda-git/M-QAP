import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiInfo } from 'src/doi-info';
import * as FormData from 'form-data';
const https = require('https');
import { HttpService } from '@nestjs/axios';
@Injectable()
export class DoiService {
  private readonly logger = new Logger(DoiService.name);
  constructor(private httpService: HttpService, private ai: AI) {}

  isDOI(doi): any {
    const result = new RegExp(`(?<=)10\..*`).exec(doi);
    return result ? result[0].toLowerCase() : false;
  }

  async isDOIExist(doi) {
    const link = `https://dx.doi.org/${doi}`;
    return await this.httpService
      .get(link, {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      })
      .pipe(
        map((d) => {
          if (d && d.status) return d.status;
          else return 404;
        }),
      )
      .toPromise()
      .catch((d) => d.response.status);
  }
  async crossrefAgency(doi) {
    const link = `https://api.crossref.org/works/${doi}/agency`;
    return await this.httpService
      .get(link)
      .pipe(
        map((d) => {
          if (
            d.data &&
            d.data.message &&
            d.data.message.agency &&
            d.data.message.agency.id
          )
            return d.data.message.agency.id;
          else return null;
        }),
      )
      .toPromise()
      .catch(() => null);
  }

  newDoiInfo(): DoiInfo {
    return {
      publication_type: null,
      volume: null,
      issue: null,
      is_isi: null,
      doi: null,
      oa_link: null,
      is_oa: null,
      source: null,
      publication_year: null,
      start_end_pages: null,
      authors: [],
      title: null,
      journal_name: null,
      organizations: [],
      altmetric: null,
      gardian: null,
    } as DoiInfo;
  }
  async getWOSinfoByDoi(doi): Promise<DoiInfo> {
    await this.httpService
      .post(
        process.env.MEL_API + 'wos-user-quota-usage/external-usage',
        {
          doi: doi,
        },
        { headers: { authorization: process.env.MEL_API_KEY } },
      )
      .pipe(
        map((d: any) => d.data),
        catchError((e) => {
          this.logger.log('MEL API is not connected');
          this.logger.error(e);
          return [null];
        }),
      )
      .toPromise();
    const result: any = await this.httpService
      .get(
        `${process.env.WOS_API_URL}?databaseId=WOS&count=100&firstRecord=1&optionView=FR&usrQuery=DO=${doi}`,
        {
          headers: {
            'X-ApiKey': `${process.env.WOS_API_KEY}`,
          },
        },
      )
      .pipe(
        map((data_from_wos: any) => {
          if (data_from_wos && data_from_wos.status == 200) {
            let finaldata: DoiInfo;
            try {
              const records = data_from_wos?.data?.Data?.Records?.records;
              if (records != '') {
                records.REC.forEach((REC) => {
                  const doiData = this.newDoiInfo();
                  const summary = REC.static_data.summary;
                  const pub_info = summary.pub_info;
                  const authors = summary.names.name;
                  const titles = summary.titles.title;
                  const doctypes = summary.doctypes;
                  if (Array.isArray(doctypes.doctype))
                    doiData.publication_type = doctypes.doctype.join(', ');
                  else doiData.publication_type = doctypes.doctype;
                  const fullrecord_metadata =
                    REC.static_data.fullrecord_metadata;
                  const addresses = fullrecord_metadata.addresses;
                  const address_spec = addresses?.address_name?.address_spec;
                  try {
                    if (Array.isArray(addresses.address_name))
                      doiData.organizations = addresses.address_name.map(
                        (d) => {
                          return {
                            clarisa_id: null,
                            name: d.address_spec.organizations
                              ? typeof d.address_spec.organizations
                                  .organization === 'string' ||
                                d.address_spec.organizations
                                  .organization instanceof String
                                ? d.address_spec.organizations.organization
                                : d.address_spec.organizations.organization.map(
                                    (inst) =>
                                      Array.isArray(inst)
                                        ? inst[1].content
                                        : inst.content
                                        ? inst.content
                                        : inst,
                                  )[0]
                              : d.address_spec.full_address,
                            country: d.address_spec.country,
                            full_address: d.address_spec.full_address,
                          };
                        },
                      );
                    else if (address_spec)
                      doiData.organizations = [
                        {
                          confidant: 0,
                          clarisa_id: null,
                          name: address_spec.organizations
                            ? typeof address_spec.organizations.organization ===
                                'string' ||
                              address_spec.organizations.organization instanceof
                                String
                              ? address_spec.organizations.organization
                              : address_spec.organizations.organization.map(
                                  (institution) =>
                                    Array.isArray(institution)
                                      ? institution[1].content
                                      : institution.content
                                      ? institution.content
                                      : institution,
                                )[0]
                            : address_spec.full_address,
                          country: address_spec.country,
                          full_address: address_spec.full_address,
                        },
                      ];
                  } catch (e) {
                    console.error(e);
                  }
                  doiData.issue = pub_info.issue;
                  doiData.volume = pub_info.vol;
                  doiData.publication_type = pub_info.pubtype;
                  doiData.publication_year = pub_info.pubyear;
                  doiData.publication_sortdate = pub_info?.sortdate;
                  doiData.publication_coverdate = pub_info?.coverdate;
                  if (pub_info.page)
                    doiData.start_end_pages = pub_info.page.content;
                  else doiData.start_end_pages = null;
                  if (Array.isArray(authors))
                    doiData.authors = authors.map((d) => {
                      return d.full_name;
                    });
                  const title = titles.filter((d) => d.type == 'item')[0]
                    .content;
                  let i = [];
                  if (
                    titles.filter((d) => d.type == 'item')[0] &&
                    titles.filter((d) => d.type == 'item')[0].i
                  )
                    i = titles.filter((d) => d.type == 'item')[0].i;
                  let titlefinal = '';
                  if (Array.isArray(title))
                    title.forEach((d, index) => {
                      if (i[index])
                        titlefinal +=
                          index == 0
                            ? d + ' ' + i[index]
                            : ' ' + d + ' ' + i[index];
                      else titlefinal += index == 0 ? d : ' ' + d;
                    });
                  else titlefinal = title;
                  doiData.title = titlefinal;
                  doiData.journal_name = titles.filter(
                    (d) => d.type == 'source',
                  )[0].content;
                  doiData.doi = doi;
                  doiData.source = 'WOS';
                  doiData.is_isi = 'yes';
                  finaldata = doiData;
                });
                return finaldata;
              } else null;
            } catch (e) {
              console.error(e);
            }
          } else return null;
        }),
      )
      .toPromise()
      .catch((d) => d);
    return result;
  }
  async getScopusInfoByDoi(doi): Promise<DoiInfo> {
    const link = `https://api.elsevier.com/content/search/scopus?apiKey=${process.env.SCOPUS_API_KEY}&query=doi(${doi})`;
    const result: any = await this.httpService
      .get(link)
      .pipe(
        map((d: any) => {
          if (d && d.status == 200) {
            const doiData: DoiInfo = this.newDoiInfo();
            if (
              d.data['search-results'] &&
              d.data['search-results']['opensearch:totalResults'] > 0
            ) {
              d.data['search-results'].entry.forEach((REC) => {
                // let doi = REC.dynamic_data.cluster_related.identifiers.identifier.filter(d => d.type == 'doi')[0].value
                const date = REC['prism:coverDisplayDate'];
                const datesplited = date.split(' ');
                doiData.volume = REC['prism:volume'];
                doiData.issue = REC['prism:issueIdentifier'];
                doiData.publication_year = datesplited[1]
                  ? parseInt(datesplited[1])
                  : date;
                doiData.publication_type = REC['prism:aggregationType'];
                doiData.start_end_pages = REC['prism:pageRange'];
                doiData.authors = [REC['dc:creator']];
                doiData.publication_coverdate = REC['prism:coverDate'];
                doiData.title = REC['dc:title'];
                doiData.doi = REC['prism:doi'];
                doiData.journal_name = REC['prism:publicationName'];
                doiData.is_isi = 'no';
                doiData.source = 'Scopus';
                if (REC['affiliation'] && Array.isArray(REC['affiliation']))
                  doiData.organizations = REC['affiliation'].map((d) => {
                    return {
                      clarisa_id: null,
                      country: d['affiliation-country']
                        ? d['affiliation-country']
                        : null,
                      full_address: null,
                      name: d.affilname,
                      confidant: null,
                    };
                  });
              });
              return doiData;
            } else return null;
          } else return null;
        }),
      )
      .toPromise()
      .catch((d) => d);

    return result;
  }
  async addClarisaID(doiInfo: DoiInfo): Promise<DoiInfo> {
    const orgs = await Promise.all(
      doiInfo.organizations.map(async (d) => {
        const predection = await this.ai.makePrediction(d.name, doiInfo.doi);
        d.clarisa_id = predection.value.code;
        d.confidant = Math.round(predection.confidant * 100);
        return d;
      }),
    );
    doiInfo.organizations = orgs;
    return doiInfo;
  }

  async addOpenAccessInfo(doi) {
    const result = {};
    const openAccess_link = await this.getUnpaywallInfoByDoi(doi);
    if (openAccess_link && openAccess_link.is_oa) {
      result['oa_link'] = openAccess_link.best_oa_location.url_for_landing_page;
      result['is_oa'] = 'yes';
    } else if (openAccess_link && !openAccess_link.is_oa) {
      result['oa_link'] = null;
      result['is_oa'] = 'no';
    }
    return result;
  }
  async getInfoByDOI(doi) {
    const doiExist = await this.isDOIExist(doi);
    if (doiExist == 404)
      return new HttpException(
        `DOI (${doi}) not exist `,
        HttpStatus.BAD_REQUEST,
      );

    const results = await Promise.all([
      this.getWOSinfoByDoi(doi),
      this.getScopusInfoByDoi(doi),
      this.addOpenAccessInfo(doi),
      this.getAltmetricByDoi(doi),
      this.getGardianInfo(doi),
      this.crossrefAgency(doi),
    ]);

    let result =
      results[0] && results[0].source
        ? results[0]
        : results[1] && results[1].source
        ? results[1]
        : this.newDoiInfo();
    result.crossref = results[5];

    if (['datacite'].includes(result.crossref)) result.is_oa = 'yes';

    result.doi = result.doi ? result.doi : doi;
    result = { ...result, ...results[2] };
    result.altmetric = results[3] && results[3].title ? results[3] : null;
    result.gardian = results[4] && results[4].title ? results[4] : null;
    result.is_isi =
      results[0] && results[0].source
        ? 'yes'
        : results[1] && results[1].source
        ? 'no'
        : 'N/A';

    if (result && result != null) result = await this.addClarisaID(result);
    if (!result.is_oa && !result.altmetric && !result.source)
      return new HttpException(
        `DOI (${doi}) not found in any source`,
        HttpStatus.NOT_FOUND,
      );

    return result;
  }

  async getGardian(doi, type) {
    const data = new FormData();
    data.append('type', type);
    data.append('identifier', doi);
    return this.httpService
      .post(
        'https://gardian.bigdata.cgiar.org/api/v2/getDocumentFAIRbyIdentifier.php',
        data,
        {
          headers: {
            authorization: `Bearer ${await this.getGardianAccessToken()}`,
            ...data.getHeaders(),
          },
        },
      )
      .pipe(
        map((d) => {
          if (d && d.status == 200) {
            return d.data;
          } else return null;
        }),
      )
      .toPromise()
      .catch(() => null);
  }

  async getGardianInfo(doi, type = 'publication'): Promise<DoiInfo> {
    const gardian = await Promise.all([
      this.getGardian(`https://dx.doi.org/${doi}`, type),
      this.getGardian(`https://doi.org/${doi}`, type),
      this.getGardian(`http://dx.doi.org/${doi}`, type),
      this.getGardian(`http://doi.org/${doi}`, type),
      this.getGardian(`dx.doi.org/${doi}`, type),
      this.getGardian(`doi.org/${doi}`, type),
      this.getGardian(doi, type),
    ]);
    return gardian.length
      ? (gardian.filter((d) => d && d.title)[0] as DoiInfo)
      : ({} as DoiInfo);
  }

  async getGardianAccessToken() {
    const data = new FormData();
    data.append('password', process.env.GARDIAN_PASSWORD);
    data.append('email', process.env.GARDIAN_EMAIL);
    data.append('clientId', process.env.GARDIAN_CLIENT);
    const gardian = await this.httpService
      .post(
        'https://gardian.bigdata.cgiar.org/api/v2/getAccessToken.php',
        data,
        {
          headers: {
            ...data.getHeaders(),
          },
        },
      )
      .pipe(
        map((d) => {
          if (d && d.status == 200) {
            return d.data;
          } else return null;
        }),
      )
      .toPromise()
      .catch(() => null);
    if (gardian && gardian.access_token) return gardian.access_token;
    else return false;
  }

  async getUnpaywallInfoByDoi(doi) {
    const link = `https://api.unpaywall.org/v2/${doi}?email=MEL@icarda.org`;
    return await this.httpService
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
  }

  async getAltmetricByDoi(doi) {
    const link = `https://api.altmetric.com/v1/doi/${doi}`;
    const altmetric = await this.httpService
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
