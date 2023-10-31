export interface DoiInfo {
  doi: string | null;
  source: string | null;
  title: string | null;
  publication_type: string | null;
  publication_year: number | null;
  is_oa: 'yes' | 'no' | 'NA';
  crossref?: any | null;
  oa_link: string | null;
  is_isi: string | 'NA';
  journal_name: string;
  volume: string | null;
  issue: string | null;
  start_end_pages: string | null;
  authors: Array<author>;
  organizations: Array<organization>;
  altmetric?: any;
  gardian?: any;
  publication_sortdate?: any;
  publication_coverdate?: any;
}

export interface author {
  full_name: string;
}

export interface organization {
  confidant: number | null;
  clarisa_id: number | null;
  name: string;
  country: string | null;
  full_address: string | null;
}
