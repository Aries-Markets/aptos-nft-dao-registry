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
    "creator-nickname": string;
    "logo-url": string;
  };
};
