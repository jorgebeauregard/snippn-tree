export interface Link {
    id: number;
    title: string;
    url: string;
  }
  
  export interface UserDataResponse {
    profileImage: string;
    name: string;
    handle: string;
    links: Link[];
  }