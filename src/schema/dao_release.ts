export type DAOConfig = {
  links?: Record<
    string,
    {
      label: string;
      url: string;
    }
  >;
  governance: {
    address: string;
    description: string;
    creatorNickname: string;
    logoURL: string;
    bgImgURL?: string;
  };
};
