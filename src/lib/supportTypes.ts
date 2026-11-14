export type ShareWith = {
  platform: boolean;
  employers: boolean;
  partner: boolean;
};

export type SupportRecord = {
  needs: string[];
  shareWith: ShareWith;
};