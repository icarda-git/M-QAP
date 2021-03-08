import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiInfo } from 'src/doi-info';
import * as FormData from 'form-data'
@Injectable()
export class DoiService {

    constructor(private httpService: HttpService, private ai: AI) {
    }

    isDOI(doi): any {
        let result = new RegExp(`(?<=)10\..*`).exec(doi)
        return result ? result[0].toLowerCase() : false;
    }

    async isDOIExist(doi) {
        let link = `https://dx.doi.org/${doi}`;
        return await this.httpService.get(link).pipe(map(d => {
            return d.status
        })).toPromise().catch(d => d.response.status)
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
        } as DoiInfo
    }
    async getWOSinfoByDoi(doi): Promise<DoiInfo> {

        let link = `https://wos-api.clarivate.com/api/wos/?databaseId=WOK&count=100&firstRecord=1&optionView=FR&usrQuery=DO=${doi}`;
        let result: any = await this.httpService.get(link, {
            headers: {
                'X-ApiKey': `${process.env.WOS_API_KEY}`
            }
        }).pipe(map((d: any) => {
            if (d.status == 200) {
                let finaldata: DoiInfo;
                if (d.data.Data.Records.records != '') {
                    d.data.Data.Records.records.REC.forEach(REC => {
                        let doiData = this.newDoiInfo()
                        let summary = REC.static_data.summary
                        let pub_info = summary.pub_info
                        let authors = summary.names.name
                        let titles = summary.titles.title
                        let doctypes = summary.doctypes
                        if (Array.isArray(doctypes.doctype))
                            doiData.publication_type = doctypes.doctype.join(', ')
                        else
                            doiData.publication_type = doctypes.doctype

                        let fullrecord_metadata = REC.static_data.fullrecord_metadata
                        let addresses = fullrecord_metadata.addresses
                        doiData.organizations = addresses.address_name.map(d => {
                            return {
                                clarisa_id: null,
                                name: d.address_spec.organizations.organization.map(inst => Array.isArray(inst) ? inst[1].content : inst.content ? inst.content : inst)[0],
                                country: d.address_spec.country,
                                full_address: d.address_spec.full_address
                            };
                        })

                        doiData.issue = pub_info.issue
                        doiData.volume = pub_info.vol
                        doiData.publication_year = pub_info.pubyear
                        doiData.publication_type = pub_info.pubtype
                        if (pub_info.page)
                            doiData.start_end_pages = pub_info.page.content
                        else
                            doiData.start_end_pages = null;

                        if (Array.isArray(authors))
                            doiData.authors = authors.map(d => { return { full_name: d.full_name } })
                        doiData.title = titles.filter(d => d.type == 'item')[0].content
                        doiData.journal_name = titles.filter(d => d.type == 'source')[0].content
                        doiData.doi = doi;
                        doiData.source = 'WOS';
                        doiData.is_isi = 'yes';
                        finaldata = doiData;

                    });
                    return finaldata;
                } else null
            } else
                return null;
        })).toPromise().catch(d => d)

        return result;
    }
    async getScopusInfoByDoi(doi): Promise<DoiInfo> {
        let link = `https://api.elsevier.com/content/search/scopus?apiKey=${process.env.SCOPUS_API_KEY}&query=doi(${doi})`;
        let result: any = await this.httpService.get(link, {
            headers: {
                'X-ApiKey': 'd869e3d25b2b79cd03ff021fe40b7e9d4fb04967'
            }
        }).pipe(map((d: any) => {
            if (d.status == 200) {
                let doiData: DoiInfo = this.newDoiInfo()
                if (d.data['search-results'] && d.data['search-results']['opensearch:totalResults'] > 0) {
                    d.data['search-results'].entry.forEach(REC => {

                        // let doi = REC.dynamic_data.cluster_related.identifiers.identifier.filter(d => d.type == 'doi')[0].value
                        let date = REC['prism:coverDisplayDate']
                        let datesplited = date.split(' ');
                        doiData.volume = REC['prism:volume']
                        doiData.issue = REC['prism:issueIdentifier']
                        doiData.publication_year = datesplited[1] ? parseInt(datesplited[1]) : date;
                        doiData.publication_type = REC['prism:aggregationType']
                        doiData.start_end_pages = REC['prism:pageRange']
                        doiData.authors = [{ full_name: REC['dc:creator'] }];
                        doiData.title = REC['dc:title'];
                        doiData.doi = REC['prism:doi'];
                        doiData.journal_name = REC['prism:publicationName'];
                        doiData.is_isi = 'no';
                        doiData.source = 'Scopus';
                        if (REC['affiliation'] && Array.isArray(REC['affiliation']))
                            doiData.organizations = REC['affiliation'].map(d => {
                                return {
                                    clarisa_id: null,
                                    country: d['affiliation-country'] ? d['affiliation-country'] : null,
                                    full_address: null,
                                    name: d.affilname,
                                    confidant: null
                                }
                            })
                    });
                    return doiData;
                } else
                    return null;
            } else
                return null;
        })).toPromise().catch(d => d)

        return result;

    }
    async addClarisaID(doiInfo: DoiInfo): Promise<DoiInfo> {
        let orgs = await Promise.all(doiInfo.organizations.map(async (d) => {
            let predection = await this.ai.makePrediction(d.name,doiInfo.doi);
            d.clarisa_id = predection.value.code;
            d.confidant = Math.round(predection.confidant * 100);
            return d;
        }));
        doiInfo.organizations = orgs;
        return doiInfo;
    }

    async addOpenAccessInfo(doi) {
        let result = {};
        let openAccess_link = await this.getUnpaywallInfoByDoi(doi);
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
        let doiExist = await this.isDOIExist(doi)
        if (doiExist == 404)
            throw new HttpException(`DOI (${doi}) not exist `, HttpStatus.BAD_REQUEST);


        let results = await Promise.all([
            this.getWOSinfoByDoi(doi),
            this.getScopusInfoByDoi(doi),
            this.addOpenAccessInfo(doi),
            this.getAltmetricByDoi(doi),
            this.getGardianInfo(doi)
        ]);

        let result = results[0] && results[0].source ? results[0] : results[1] && results[1].source ? results[1] : this.newDoiInfo();
        result.doi = result.doi ? result.doi : doi;
        result = { ...result, ...results[2] }
        result.altmetric = results[3] && results[3].title ? results[3] : null;
        result.gardian = results[4] && results[4].title ? results[4] : null;
        let sources = [results[0], results[1]]
        let is_isi = sources.map(d => {
            if (d && d.source)
                return d.source
        }).filter(d => d);
        result.is_isi = is_isi.length > 1 ? 'yes' : is_isi[0] ? "no" : "N/A"
        if (result && result != null)
            result = await this.addClarisaID(result);
        if (!result.is_oa && !result.altmetric && !result.source)
            throw new HttpException(`DOI (${doi}) not found in any source`, HttpStatus.NOT_FOUND);

        return result;
    }


    async getGardianInfo(doi) {
        let data = new FormData()
        data.append('type', 'publication')
        data.append('identifier', doi)
        let gardian = await this.httpService.post('https://gardian.bigdata.cgiar.org/api/v2/getDocumentFAIRbyIdentifier.php', data, {
            headers: {
                'authorization': `Bearer ${await this.getGardianAccessToken()}`,
                ...data.getHeaders()
            }
        }).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)

        return gardian;
    }


    async getGardianAccessToken() {
        var data = new FormData();
        data.append('password', process.env.GARDIAN_PASSWORD);
        data.append('email', process.env.GARDIAN_EMAIL);
        data.append('clientId', process.env.GARDIAN_CLIENT);
        let gardian = await this.httpService.post('https://gardian.bigdata.cgiar.org/api/v2/getAccessToken.php', data, {
            headers: {
                ...data.getHeaders()
            }
        }).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)
        if (gardian.access_token)
            return gardian.access_token;
        else
            return false;
    }


    async getUnpaywallInfoByDoi(doi) {
        let link = `https://api.unpaywall.org/v2/${doi}?email=MEL@icarda.org`;
        return await this.httpService.get(link).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)
    }

    async getAltmetricByDoi(doi) {
        let link = `https://api.altmetric.com/v1/doi/${doi}`;
        let altmetric = await this.httpService.get(link).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)

        return altmetric;
    }

}
