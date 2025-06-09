type AppEnvironment = {
  baseService: string;
  logoutTime: number;
  authUrl: string;
};
export const environment: AppEnvironment = {
baseService: 'http://localhost:8080',
 // baseService: 'http://redpersonalihe.seph.gob.mx:8088',
 // baseService: 'http://10.10.10.15:8088',
  logoutTime: 10680000,
  authUrl: 'https://www.google.com'
};
//ng build --configuration=production
