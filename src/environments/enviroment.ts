type AppEnvironment = {
  baseService: string;
  logoutTime: number;
  authUrl: string;
};
export const environment: AppEnvironment = {
  baseService: 'http://localhost:8080/api',
 //baseService: 'https://softnova.dev/api',//Test
//  baseService: 'https://softnova.com.mx/api',//Produccion
  logoutTime: 10680000,
  authUrl: 'https://www.google.com'
};
//ng build --configuration=production
