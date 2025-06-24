type AppEnvironment = {
  baseService: string;
  logoutTime: number;
  authUrl: string;
};
export const environment: AppEnvironment = {
 baseService: 'http://localhost:8080',
 // baseService: 'http://redpersonalihe.seph.gob.mx:8088',
 // baseService: 'http://217.196.50.77:8083',
  logoutTime: 10680000,
  authUrl: 'https://www.google.com'
};
//ng build --configuration=production
