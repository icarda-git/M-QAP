import { Injectable, HttpService } from '@nestjs/common';
import { Workbook, Worksheet, Row } from 'exceljs'
import { join } from 'path';
import { map } from 'rxjs/operators';
import { SendGridService } from '../../services/send-grid/send-grid.service';
import * as stringSimilarity from 'string-similarity';
import { DoiSearch } from '../../services/search/doi-search.service';
import { AI } from './AI/ai.service';
let doireg = new RegExp(`(?<=)10\..*`)

let mapedLable = {
    'DOI': 1,
    'title': 2,
    'authors': 3,
    'Date': 4,
    'journal': 5,
    'volume': 6,
    'issue': 7,
    'pages': 8,
    'is_OA': 9,
    'OA link': 10,
    'IS_ISI': 11,
    'partner_id': 12,
    'partner_name': 13,
    'partner_acronym': 14,
    'partner_website': 15,
    'partner_type': 16,
    'partner_HQ': 17,
    'partner_HQ_name': 18,
    'WOS institution name': 19,
    'Confident %': 20,
    'Confident Type': 21,
    'Request_id': 22,
    'Confirmed': 23,
    'Clarisa_ID': 24
};
@Injectable()
export class WosService {
    cleanup(entity_name) {
        return entity_name.trim()
    }
    constructor(private httpclient: HttpService,
        private doiSearch: DoiSearch,
        private sendGridService: SendGridService,
        private ai: AI
    ) { }

    training() {
        this.ai.startTraning();
    }

    async saveClarisaID(outputWorkSheet, workbook, filename) {
        let idwithdoi = []
        workbook.getWorksheet("Input").eachRow(async (row, row_num) => {
            if (row_num > 1) {
                let match = doireg.exec(row.getCell(2).text.split('?')[0].trim().toLowerCase())
                idwithdoi.push({ clarisa_id: row.getCell(1).value, doi: match ? match[0] ? match[0].trim().toLowerCase() : row.getCell(2).text.split('?')[0].trim().toLowerCase() : row.getCell(2).text.split('?')[0].trim().toLowerCase() })
            }
        });
        let toadd = [];
        outputWorkSheet.eachRow(async (row, row_num) => {
            if (row_num > 1) {
                let result = idwithdoi.filter(d => d.doi == row.getCell(mapedLable['DOI']).value)

                if (result && result.length)
                    result.forEach((element, index) => {
                        if (index == 0)
                            row.getCell(mapedLable['Clarisa_ID']).value = element.clarisa_id
                        else {
                            let rowArray = row.values
                            rowArray[23] = element.clarisa_id
                            toadd.push(rowArray)
                        }
                    });
            }
        });
        toadd.forEach(element => outputWorkSheet.addRow(element))
        await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
    }

    async audit(filename, userinfo) {
        let dois = []
        // read from a file
        const workbook = new Workbook();
        await workbook.xlsx.readFile(join(process.env.UPLOADS_DIR, '/wos/', filename));
        workbook.getWorksheet("Input").eachRow(async (row, row_num) => {
            if (row_num > 1) {
                let match = doireg.exec(row.getCell(mapedLable['title']).text.split('?')[0].trim())
                dois.push({ row_num, is_doi: match ? match[0] ? true : false : false, doi: match ? match[0] ? match[0].trim().toLowerCase() : row.getCell(mapedLable['title']).text.split('?')[0].trim() : row.getCell(mapedLable['title']).text.split('?')[0].trim() })
            }
        });
        this.saveWOSToFile(dois, workbook, filename, userinfo)

        return { filename, message: "The file has been submitted successfully and an email will be sent once the file ready. Processing time may take between 1 minute to 2 hours based on the file size." };
    }
    async saveClarisaToFile(outputWorkSheet: Worksheet, workbook, filename) {
        let clarisaInstitution = await this.httpclient.get(process.env.CLARISA_API + '/institutions', { auth: { username: process.env.CLARISA_USERNAME, password: process.env.CLARISA_PASSWORD } }).pipe(map((d) => {
            return d.data.map(d => {
                let office = d.countryOfficeDTO.filter(d => d.isHeadquarter)[0]
                return {
                    id: d.code,
                    name: d.name,
                    acronym: d.acronym,
                    website: d.websiteLink,
                    type: d.institutionType.name,
                    iso: office.isoAlpha2,
                    location: office.name
                }
            })
        })).toPromise().catch(d => d)
        let arrayOfInstNames = clarisaInstitution.map(d => d.name)
        let arrayOfInstNamesWithinfo = clarisaInstitution.map(d => `${d.name} ${d.acronym ? d.acronym + ' ' : ''}${d.location ? d.location : ''}`)
        let arrayOfInstAcronym = clarisaInstitution.map(d => `${d.acronym}`)
        await outputWorkSheet.eachRow(async (row, row_num) => {
            if (row_num > 1 && row.getCell(mapedLable['WOS institution name']).text != 'N/A' && row.getCell(mapedLable['WOS institution name']).text != null && row.getCell(mapedLable['WOS institution name']).text != '') {
                let maxMatch = 0.0;
                let Matches;
                row.getCell(mapedLable['WOS institution name']).text.replace(/[0-9]/g, '').split(',').forEach(d => {
                    let matchs = stringSimilarity.findBestMatch(this.cleanup(d), arrayOfInstNames);
                    if (maxMatch < matchs.bestMatch.rating) {
                        maxMatch = matchs.bestMatch.rating
                        Matches = matchs
                    }
                })
                row.getCell(mapedLable['Confident %']).value = 'N/A'
                if (Matches && Matches.bestMatch.rating != 1) {
                    let matchsSecond = stringSimilarity.findBestMatch(row.getCell(mapedLable['WOS institution name']).text.replace(/[0-9]/g, '').trim(), arrayOfInstNamesWithinfo);
                    if (matchsSecond.bestMatch.rating >= Matches.bestMatch.rating)
                        Matches = matchsSecond
                }
                if (!Matches || Matches.bestMatch.rating != 1) {
                    let acroMatches
                    let acroMaxMatch = 0.0;
                    row.getCell(mapedLable['WOS institution name']).text.trim().replace('(', '').replace(')', '').replace(',', '').replace(/[0-9]/g, '').split(' ').forEach(d => {
                        let matchsthird = stringSimilarity.findBestMatch(d.trim(), arrayOfInstAcronym);
                        if (acroMaxMatch < matchsthird.bestMatch.rating) {
                            acroMaxMatch = matchsthird.bestMatch.rating
                            acroMatches = matchsthird
                        }
                    })
                    if (acroMatches && acroMatches.bestMatch.rating == 1)
                        Matches = acroMatches
                }

                let predictionResult = await this.ai.makePrediction(row.getCell(mapedLable['WOS institution name']).text)

                if (Matches || predictionResult.confidant) {
                    let insttution;
                    if (predictionResult.confidant > 0.49 && Matches.bestMatch.rating != 1) {
                        row.getCell(mapedLable['Confident %']).value = predictionResult.confidant;
                        row.getCell(mapedLable['Confident Type']).value = 'AI';
                        insttution = clarisaInstitution[predictionResult.value]
                    } else {
                        row.getCell(mapedLable['Confident %']).value = Matches.bestMatch.rating;
                        row.getCell(mapedLable['Confident Type']).value = 'Similarity';
                        insttution = clarisaInstitution[Matches.bestMatchIndex];
                    }

                    row.getCell(mapedLable['partner_id']).value = insttution.id
                    row.getCell(mapedLable['partner_name']).value = insttution.name
                    row.getCell(mapedLable['partner_acronym']).value = insttution.acronym
                    row.getCell(mapedLable['partner_website']).value = insttution.website
                    row.getCell(mapedLable['partner_type']).value = insttution.type
                    row.getCell(mapedLable['partner_HQ']).value = insttution.iso
                    row.getCell(mapedLable['partner_HQ_name']).value = insttution.location
                }
            }
        })
        await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
    }
    async saveOAToFile(outputWorkSheet: Worksheet, workbook, filename) {
        let dois = []
        await outputWorkSheet.eachRow(async (row, row_num) => {
            if (row_num > 1)
                dois.push({ row_num, doi: row.getCell(mapedLable['DOI']).text.toLowerCase() });
        })
        let validatedDois = {};
        for (let item of dois) {
            if (item.is_doi == false) {
                outputWorkSheet.getRow(item.row_num).getCell(mapedLable['is_OA']).value = 'N/A'
                outputWorkSheet.getRow(item.row_num).getCell(mapedLable['OA link']).value = 'N/A'
            } else if (!validatedDois[item.doi]) {
                let OA = await this.validateOA(item.doi);
                if (OA) {
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['is_OA']).value = OA.is_oa ? 'Yes' : 'No'
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['OA link']).value = OA.is_oa ? OA.best_oa_location.url_for_landing_page : 'N/A'
                    validatedDois[item.doi] = OA
                } else {
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['is_OA']).value = 'N/A'
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['OA link']).value = 'N/A'
                    validatedDois[item.doi] = OA
                }
            } else {
                if (validatedDois[item.doi]) {
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['is_OA']).value = validatedDois[item.doi].is_oa ? 'Yes' : 'No'
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['OA link']).value = validatedDois[item.doi].is_oa ? validatedDois[item.doi].best_oa_location.url_for_landing_page : 'N/A'
                } else {
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['is_OA']).value = 'N/A'
                    outputWorkSheet.getRow(item.row_num).getCell(mapedLable['OA link']).value = 'N/A'
                }
            }
        }
        await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
    }

    async saveWOSToFileFromMemory(dois, workbook, outputWorkSheet: Worksheet, filename) {
        let result: Array<any> = await this.doiSearch.searchByDOIs(dois);

        result.forEach(doistoadd => {
            doistoadd.insttutions.forEach((insttution) => {
                const rowValues = [];
                Object.keys(mapedLable).forEach(d => {
                    if (doistoadd[d])
                        rowValues[mapedLable[d]] = doistoadd[d]
                    if (insttution[d])
                        rowValues[mapedLable[d]] = insttution[d]
                })
                outputWorkSheet.addRow(rowValues);
            });
        })
        await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
        if (result.length > 0) {
            let toCheckDois: Array<any> = result.map(d => d.DOI)
            return dois.filter(d => toCheckDois.indexOf(d.doi) == -1);
        } else
            return dois;
    }

    async saveWOSToFile(doi, workbook, filename, userinfo) {
        let outputWorkSheet: Worksheet = workbook.getWorksheet('Output')
        let dois = await this.saveWOSToFileFromMemory(doi.filter(d => d.is_doi), workbook, outputWorkSheet, filename);
        if (dois.length > 0) {
            let result: any = await this.validateWOS(dois.filter(d => d.is_doi))
            dois.map(item => {
                item['wos'] = result[item.doi] ? result[item.doi] : undefined;
                return item;
            })

            for (const itemToValidate of dois) {

                if (itemToValidate.wos) {
                    if (itemToValidate.wos.insttutions.length)
                        itemToValidate.wos.insttutions.forEach((insttution) => {
                            const rowValues = [];
                            rowValues[mapedLable['title']] = itemToValidate.wos.title
                            rowValues[mapedLable['authors']] = itemToValidate.wos.authors;
                            rowValues[mapedLable['Date']] = itemToValidate.wos.pubyear;
                            rowValues[mapedLable['journal']] = itemToValidate.wos.journal;
                            rowValues[mapedLable['volume']] = itemToValidate.wos.vol;
                            rowValues[mapedLable['issue']] = itemToValidate.wos.issue;
                            rowValues[mapedLable['pages']] = itemToValidate.wos.page_content;
                            rowValues[mapedLable['IS_ISI']] = 'yes';
                            rowValues[mapedLable['DOI']] = itemToValidate.doi;
                            rowValues[mapedLable['WOS institution name']] = insttution;
                            outputWorkSheet.addRow(rowValues);
                        });
                    else {
                        const rowValues = [];
                        rowValues[mapedLable['title']] = itemToValidate.wos.title;
                        rowValues[mapedLable['authors']] = itemToValidate.wos.authors;
                        rowValues[mapedLable['Date']] = itemToValidate.wos.pubyear;
                        rowValues[mapedLable['journal']] = itemToValidate.wos.journal;
                        rowValues[mapedLable['volume']] = itemToValidate.wos.vol;
                        rowValues[mapedLable['issue']] = itemToValidate.wos.issue;
                        rowValues[mapedLable['pages']] = itemToValidate.wos.page_content;
                        rowValues[mapedLable['IS_ISI']] = 'yes';
                        rowValues[mapedLable['DOI']] = itemToValidate.doi;
                        rowValues[mapedLable['WOS institution name']] = 'N/A';
                        outputWorkSheet.addRow(rowValues);
                    }

                } else {
                    const rowValues = [];
                    rowValues[mapedLable['title']] = 'N/A';
                    rowValues[mapedLable['authors']] = 'N/A';
                    rowValues[mapedLable['Date']] = 'N/A';
                    rowValues[mapedLable['journal']] = 'N/A';
                    rowValues[mapedLable['volume']] = 'N/A';
                    rowValues[mapedLable['issue']] = 'N/A';
                    rowValues[mapedLable['pages']] = 'N/A';
                    rowValues[mapedLable['IS_ISI']] = 'N/A';
                    rowValues[mapedLable['DOI']] = itemToValidate.doi;
                    rowValues[mapedLable['WOS institution name']] = 'N/A';
                    outputWorkSheet.addRow(rowValues);
                }
            }

            await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
            await this.saveScopusToFile(outputWorkSheet, workbook, filename)
            await this.saveClarisaToFile(outputWorkSheet, workbook, filename)
            await this.saveClarisaID(outputWorkSheet, workbook, filename)
            await this.saveOAToFile(outputWorkSheet, workbook, filename)
            await this.saveToElasticSearch(outputWorkSheet)
        } else {
            await this.saveClarisaToFile(outputWorkSheet, workbook, filename)
            await this.saveClarisaID(outputWorkSheet, workbook, filename)
        }
        await this.finishValidating(filename, userinfo)
    }
    formatTosave(data) {
        function makeInsttution(data) {
            let { Request_id, Confirmed, partner_id, partner_name, partner_acronym, partner_website, partner_type, partner_HQ, partner_HQ_name } = data;
            return {
                partner_id,
                partner_name,
                partner_acronym,
                partner_website,
                partner_type,
                partner_HQ,
                partner_HQ_name,
                'WOS institution name': data['WOS institution name'],
                'Confident %': data['Confident %'],
                Request_id,
                Confirmed
            }
        }
        let obj = {}
        data.forEach(dataToSave => {
            if (obj[dataToSave.DOI])
                obj[dataToSave.DOI]['insttutions'].push(makeInsttution(dataToSave))
            else {
                let { DOI, title, authors, Date, journal, volume, is_OA, IS_ISI, pages, issue, } = dataToSave;
                obj[dataToSave.DOI] = { DOI, title, authors, Date, journal, volume, is_OA, IS_ISI, pages, issue, insttutions: [] };
                obj[dataToSave.DOI]['insttutions'].push(makeInsttution(dataToSave));
            }
        });
        return Object.values(obj);
    }
    async saveToElasticSearch(outputWorkSheet: Worksheet) {
        let dataToSave = []
        outputWorkSheet.eachRow((row, row_num) => {
            if (row_num > 1) {
                let obj = {};
                row.eachCell((cell, cell_num) => {
                    if (mapedLable[cell_num])
                        obj[mapedLable[cell_num]] = cell.value
                })
                dataToSave.push(obj);
            }
        })

        await this.doiSearch.addbulk(this.formatTosave(dataToSave));

    }

    async saveScopusToFile(outputWorkSheet: Worksheet, workbook: Workbook, filename) {
        let doiToCheck = []
        outputWorkSheet.eachRow((row, row_num) => {
            if (row_num > 1) {
                let match = doireg.exec(row.getCell(mapedLable['DOI']).text.split('?')[0].trim())
                if (row.getCell('K').value == 'N/A' && match ? match[0] ? true : false : false) {
                    doiToCheck.push({ doi: row.getCell(mapedLable['DOI']).value, row_num })
                }
            }
        })
        let result = await this.validateScopus(doiToCheck)
        let rowstodelete = doiToCheck.filter(d => Object.keys(result).indexOf(d.doi) != -1)
        rowstodelete.forEach(d => {
            let itemToValidate = result[d.doi];
            if (itemToValidate.insttutions.length) {
                itemToValidate.insttutions.forEach(insttution => {
                    const rowValues = [];
                    rowValues[mapedLable['title']] = itemToValidate.title;
                    rowValues[mapedLable['authors']] = itemToValidate.authors;
                    rowValues[mapedLable['Date']] = itemToValidate.pubyear;
                    rowValues[mapedLable['journal']] = itemToValidate.journal;
                    rowValues[mapedLable['volume']] = parseInt(itemToValidate.vol);
                    rowValues[mapedLable['issue']] = parseInt(itemToValidate.issue);
                    rowValues[mapedLable['pages']] = itemToValidate.page_content;
                    rowValues[mapedLable['IS_ISI']] = 'No';
                    rowValues[mapedLable['DOI']] = itemToValidate.doi;
                    rowValues[mapedLable['WOS institution name']] = insttution;
                    outputWorkSheet.addRow(rowValues);

                });
            } else {
                const rowValues = [];
                rowValues[mapedLable['title']] = itemToValidate.title;
                rowValues[mapedLable['authors']] = itemToValidate.authors;
                rowValues[mapedLable['Date']] = itemToValidate.pubyear;
                rowValues[mapedLable['journal']] = itemToValidate.journal;
                rowValues[mapedLable['volume']] = parseInt(itemToValidate.vol);
                rowValues[mapedLable['issue']] = parseInt(itemToValidate.issue);
                rowValues[mapedLable['pages']] = itemToValidate.page_content;
                rowValues[mapedLable['IS_ISI']] = 'No';
                rowValues[mapedLable['DOI']] = itemToValidate.doi;
                rowValues[mapedLable['WOS institution name']] = 'N/A';
                outputWorkSheet.addRow(rowValues);
            }

        })
        rowstodelete.forEach(d => {
            outputWorkSheet.eachRow((row: Row, index) => {
                if (row.getCell(mapedLable['DOI']).value == d.doi && row.getCell(mapedLable['IS_ISI']).value == 'N/A')
                    outputWorkSheet.spliceRows(index, 1)
            })
        })


        await workbook.xlsx.writeFile(join(process.env.UPLOADS_DIR, '/wos/', filename))
    }

    async finishValidating(filename, userinfo) {
        await this.sendGridService.send({
            to: userinfo.email,
            subject: 'M-QAP File is ready',
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
                <head>
                    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                </head>
                <body>
                    <p style="margin:0;">Dear ${userinfo.name.trim()},</p>
                    <p style="margin:0;">Your file is ready.</p>
                    <p style="margin:0;">Please click to the link below for downloading the file and curating the file metadata (e.g. Organizations)</p>
                    <p style="margin:0;"><a href="${process.env.QAP_URL + '/qa/qap/file-name/' + filename}">${process.env.QAP_URL + '/qa/qap/file-name/' + filename}</a></p>
                </body>
            </html>
            `,
        }).catch(e => console.error(e))
    }

    async validateDoi(doi) {
        let link = `https://doi.org/${doi}`;
        let result = await this.httpclient.get(link).pipe(map(d => d.status)).toPromise().catch(d => d)
        return result == 200 ? 'exist' : result;
    }

    async validateOA(doi) {
        let link = `https://api.unpaywall.org/v2/${doi}?email=MEL@icarda.org`;
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 500);
        });
        return await this.httpclient.get(link).pipe(map(d => {
            if (d.status == 200) {
                return d.data
            } else
                return null;
        })).toPromise().catch(d => null)
    }

    async validateScopus(dois) {
        let finalDataArray = {};
        var size = 50; var batch = [];
        for (var i = 0; i < dois.length; i += size) {
            batch.push(dois.slice(i, i + size).map(d => `doi(${d.doi})`).join(' or '));
        }
        for (let query of batch) {
            let link = `https://api.elsevier.com/content/search/scopus?apiKey=${process.env.SCOPUS_API_KEY}&query=${query}`;
            let result = await this.httpclient.get(link, {
                headers: {
                    'X-ApiKey': 'd869e3d25b2b79cd03ff021fe40b7e9d4fb04967'
                }
            }).pipe(map((d: any) => {
                if (d.status == 200) {
                    let finaldata = {};
                    if (d.data['search-results'] && d.data['search-results']['opensearch:totalResults'] > 0) {
                        d.data['search-results'].entry.forEach(REC => {
                            let doiData = {
                                vol: '',
                                issue: '',
                                pubyear: '',
                                pubtype: '',
                                page_content: '',
                                authors: '',
                                title: '',
                                journal: '',
                                insttutions: []
                            }

                            // let doi = REC.dynamic_data.cluster_related.identifiers.identifier.filter(d => d.type == 'doi')[0].value
                            let date = REC['prism:coverDisplayDate']
                            let datesplited = date.split(' ');
                            let doi = REC['prism:doi'];
                            doiData.vol = REC['prism:volume']
                            doiData.issue = REC['prism:issueIdentifier']
                            doiData.pubyear = datesplited[1] ? parseInt(datesplited[1]) : date;
                            doiData.pubtype = REC['prism:aggregationType']
                            doiData.page_content = REC['prism:pageRange']
                            doiData.authors = REC['dc:creator'];
                            doiData.title = REC['dc:title']
                            doiData.journal = REC['prism:publicationName']
                            if (REC['affiliation'] && Array.isArray(REC['affiliation']))
                                doiData.insttutions = REC['affiliation'].map(d => d.affilname)
                            finaldata[doi] = doiData;
                        });
                        return finaldata;
                    } else
                        return null;
                } else
                    return null;
            })).toPromise().catch(d => console.log(d))
            finalDataArray = { ...finalDataArray, ...result }

        }

        return finalDataArray;

    }

    async validateWOS(dois) {
        let finalDataArray = {};

        var size = 100; var batch = [];
        for (var i = 0; i < dois.length; i += size) {
            batch.push(dois.slice(i, i + size).map(d => d.doi).join(' OR DO='));
        }
        for (let query of batch) {
            let link = `https://wos-api.clarivate.com/api/wos/?databaseId=WOK&count=100&firstRecord=1&optionView=FR&usrQuery=DO=${query}`;
            let result = await this.httpclient.get(link, {
                headers: {
                    'X-ApiKey': 'key'
                }
            }).pipe(map((d: any) => {
                if (d.status == 200) {
                    let finaldata = {};
                    if (d.data.Data.Records.records != '') {
                        d.data.Data.Records.records.REC.forEach(REC => {
                            let doiData = {
                                vol: '',
                                issue: '',
                                pubyear: '',
                                pubtype: '',
                                page_content: '',
                                authors: '',
                                title: '',
                                journal: '',
                                insttutions: []
                            }
                            let summary = REC.static_data.summary
                            let identifier = REC.dynamic_data.cluster_related.identifiers.identifier
                            // let doi = REC.dynamic_data.cluster_related.identifiers.identifier.filter(d => d.type == 'doi')[0].value
                            let doi;
                            if (identifier) {
                                dois = identifier.filter(d => d.type == 'doi' || d.type == 'xref_doi').pop();
                                if (dois)
                                    doi = dois.value.toLowerCase()
                            }
                            let pub_info = summary.pub_info
                            let authors = summary.names.name
                            let titles = summary.titles.title
                            let fullrecord_metadata = REC.static_data.fullrecord_metadata
                            let addresses = fullrecord_metadata.addresses
                            if (Array.isArray(addresses.address_name)) {
                                try {
                                    let insttutions = addresses.address_name.map(address => address.address_spec.organizations ? address.address_spec.organizations.organization : address.address_spec.full_address);
                                    if (Array.isArray(insttutions))
                                        doiData.insttutions = [...new Set(insttutions.map(inst => Array.isArray(inst) ? inst[1].content : inst.content ? inst.content : inst))];
                                    else
                                        doiData.insttutions = [insttutions];
                                } catch (e) {
                                }
                            } else {
                                try {
                                    if (addresses.address_name && addresses.address_name.address_spec && addresses.address_name.address_spec.organizations && addresses.address_name.address_spec.organizations.organization) {
                                        let insttutions = addresses.address_name.address_spec.organizations.organization
                                        if (Array.isArray(insttutions))
                                            doiData.insttutions = [...new Set(insttutions.map(inst => Array.isArray(inst) ? inst[1].content : inst.content ? inst.content : inst))];
                                        else
                                            doiData.insttutions = [insttutions];
                                    } else if (addresses.address_name && addresses.address_name.address_spec && addresses.address_name.address_spec.full_address) {
                                        let insttutions = addresses.address_name.address_spec.full_address;
                                        if (Array.isArray(insttutions))
                                            doiData.insttutions = [...new Set(insttutions.map(inst => Array.isArray(inst) ? inst[1].content : inst.content ? inst.content : inst))];
                                        else
                                            doiData.insttutions = [insttutions];
                                    }
                                } catch (e) {
                                    console.log('doi =>>>> ', doi, ' =>>>> ', e);
                                }
                            }
                            doiData.issue = pub_info.issue
                            doiData.vol = pub_info.vol
                            doiData.pubyear = pub_info.pubyear
                            doiData.pubtype = pub_info.pubtype
                            if (pub_info.page)
                                doiData.page_content = pub_info.page.content
                            if (Array.isArray(authors))
                                doiData.authors = authors.map(d => d.full_name).join('|')
                            doiData.authors = doiData.authors.replace(/\,/g, '')
                            doiData.authors = doiData.authors.replace(/\|/g, ', ')
                            doiData.title = titles.filter(d => d.type == 'item')[0].content
                            doiData.journal = titles.filter(d => d.type == 'source')[0].content
                            finaldata[doi] = doiData;

                        });
                        return finaldata;
                    } else
                        return null;
                } else
                    return null;
            })).toPromise().catch(d => console.log(d))
            finalDataArray = { ...finalDataArray, ...result }

        }

        return finalDataArray;

    }

    async readfile() {
        let workbook = new Workbook();
        workbook = await workbook.xlsx.readFile('/Users/moayad/Documents/matched.xlsx');
        let worksheet: Worksheet = workbook.getWorksheet(1);
        let matchings = {}
        let clarisaInstitution = await this.httpclient.get(process.env.CLARISA_API + '/institutions', { auth: { username: process.env.CLARISA_USERNAME, password: process.env.CLARISA_PASSWORD } }).pipe(map((d: any) => {
            return d.data.map(d => {
                let office = d.countryOfficeDTO.filter(d => d.isHeadquarter)[0]
                return {
                    id: d.code,
                    name: d.name,
                    acronym: d.acronym,
                    website: d.websiteLink,
                    type: d.institutionType.name,
                    iso: office.isoAlpha2,
                    location: office.name
                }
            })
        })).toPromise().catch(d => d)
        worksheet.eachRow((row, row_number) => {
            if (row.getCell(mapedLable['title']).text.trim() != row.getCell(mapedLable['authors']).text.trim() && row.getCell(mapedLable['authors']).text.trim().indexOf(',') == -1)
                matchings[row.getCell(mapedLable['authors']).text.trim()] = row.getCell(mapedLable['title']).text.trim()
            else if (row.getCell(mapedLable['authors']).text.trim().indexOf(',') != -1) {
                let maxMatch = 0.0;
                let Matches;
                (row.getCell(mapedLable['authors']).value as string).split(',').forEach(d => {
                    let matchs = stringSimilarity.findBestMatch(d, clarisaInstitution.map(d => d.name));
                    if (maxMatch < matchs.bestMatch.rating) {
                        maxMatch = matchs.bestMatch.rating
                        Matches = { matchs, d }
                    }
                })
                if (Matches.matchs.bestMatch.target == row.getCell(mapedLable['title']).text.trim()) {
                    matchings[Matches.d.trim()] = row.getCell(mapedLable['title']).text.trim()
                }
            }
        })



        return matchings;
    }


}
