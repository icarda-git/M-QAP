import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AI } from 'src/ai/ai.service';
import { DoiInfo } from 'src/doi-info';

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

    async getWOSInfoByDOI(doi) {
        console.log()
        if (await this.isDOIExist(doi) != 200)
            throw new HttpException('BadRequst DOI is not exist', HttpStatus.BAD_REQUEST);
        let link = `https://wos-api.clarivate.com/api/wos/?databaseId=WOK&count=100&firstRecord=1&optionView=FR&usrQuery=DO=${doi}`;
        let result: any = {};
        result = await this.httpService.get(link, {
            headers: {
                'X-ApiKey': 'd869e3d25b2b79cd03ff021fe40b7e9d4fb04967'
            }
        }).pipe(map((d: any) => {
            if (d.status == 200) {
                let finaldata: DoiInfo;
                if (d.data.Data.Records.records != '') {
                    d.data.Data.Records.records.REC.forEach(REC => {
                        let doiData: DoiInfo = {
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
                            title: '',
                            journal_name: null,
                            organizations: [],
                        }
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
                        doiData.organizations.map(async (d) => {
                            let predection = await this.ai.makePrediction(d.name)
                            d.clarisa_id = predection.value.code;
                            d.confidant = Math.round(predection.confidant * 100);
                        })
                        doiData.issue = pub_info.issue
                        doiData.volume = pub_info.vol
                        doiData.publication_year = pub_info.pubyear
                        doiData.publication_type = pub_info.pubtype
                        if (pub_info.page)
                            doiData.start_end_pages = pub_info.page.content
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
                } else
                    return null;
            } else
                return null;
        })).toPromise().catch(d => console.log(d))
        let openAccess_link = await this.validateOA(doi);
        if (!result)
            result = {};
        if (openAccess_link && openAccess_link.is_oa) {
            result['oa_link'] = openAccess_link.best_oa_location.url_for_landing_page;
            result['is_oa'] = 'yes';
        } else if (openAccess_link && !openAccess_link.is_oa) {
            result['oa_link'] = null;
            result['is_oa'] = 'no';
        }

        return result;
    }

    async validateOA(doi) {
        let link = `https://api.unpaywall.org/v2/${doi}?email=MEL@icarda.org`;
        return await this.httpService.get(link).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)
    }

}
