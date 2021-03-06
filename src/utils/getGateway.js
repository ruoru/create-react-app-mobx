import environments from '../../packages/environments';
import Gateway from './Gateway';

var cachedGateway = null;

function getGateway(options) {
  console.log(process.env)
  const environment = environments[process.env.NODE_ENV];
  if (!cachedGateway) {
    cachedGateway = new Gateway({
      api: environment.api,
    }, {
      onAuthFail: error => {
        window.localStorage.clear();
        document.cookie = null;
        window.location.href = `http://sso.gowild.top/login/?redirectURL=http:${environment.api}&&authURL=http:${environment.api}/sso_auth/`;
      }
    });
  }
  return cachedGateway;
}

export default getGateway();