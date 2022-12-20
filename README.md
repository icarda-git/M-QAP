# The Monitoring, Evaluation and Learning Quality Assurance Processor

The Monitoring, Evaluation and Learning Quality Assurance Processor (M-QAP) is a publications metadata extractor from the Web of Science (https://clarivate.com/webofsciencegroup/solutions/xml-and-apis/), Scopus (https://dev.elsevier.com/), Unpaywall (https://unpaywall.org/), and Crossref (https://www.crossref.org/documentation/retrieve-metadata/rest-api/). It was created to support the reporting of CGIAR institutions to its dashboard (https://www.cgiar.org/impact/results-dashboard/) and ensure that publications with a DOI are validated against the above mentioned sources.


Additionally, the tool matches institution names with CGIAR lists (https://clarisa.cgiar.org). CGIAR Users can submit a list of DOIs with own reference ID to export verified data. M-QAP provides a facility to submit a request for new institutions to be added to CLARISA List. Institutions pairing is done as 100% text matching or allowing the user to confirm the pairing when the similarity test is less than 100%. The tool has also an AI feature to pair institutions based on previous matching. The AI will only pair when institutions are manually matched multiple times however the user should always confirm the AI matching when reaching 100% since the tool is in pilot phase.


M-QAP began as a proof of concept designed by the Monitoring, Evaluation and Learning (https://mel.cgiar.org/) team at the International Center for Agricultural Research in the Dry Areas (ICARDA) (http://icarda.org/) with the financial support of the System Management Office (SMO) (https://www.cgiar.org/how-we-work/governance/system-organization/system-management-office/). It has been developed by CodeObia (https://codeobia.com/). The code is available at: https://github.com/icarda-git/M-QAP.


Submission into interface will retrieve metadata according to standard SMO structure to feed https://www.cgiar.org/impact/results-dashboard/.


## References

De Col V., Bonaiuti E. (2022). How the Web of Science enables innovation in agriculture. Clarivate blog. https://clarivate.com/blog/how-the-web-of-science-enables-innovation-in-agriculture/ 

De Col V., Jani S., Bonaiuti E. (2021). Monitoring-Quality Assurance Processor-API - A tool to support CGIAR Quality Assurance process for peer-reviewed publications. https://hdl.handle.net/20.500.11766/13115 

De Col V., Jani S., Rünzel M., Tobon H., Almanzar M., See D.S., Bonaiuti E. (2021). Case study on the Monitoring-Quality Assurance Processor-API - A tool to support CGIAR Quality Assurance process for peer-reviewed publications. https://hdl.handle.net/20.500.11766/66480

## Installation

```bash
$ docker-compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```



