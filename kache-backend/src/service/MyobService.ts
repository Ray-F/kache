import fetch from 'node-fetch';
import { URLSearchParams } from 'url';

const MYOB_OAUTH_URL = 'https://secure.myob.com/oauth2/account/authorize';
const MYOB_AUTHORISE_URL = 'https://secure.myob.com/oauth2/v1/authorize';
const AR_BASE_URL = 'https://api.myob.com/accountright';

type GeneratedToken = {
  access_token: string,
  refresh_token: string,

  user: {
    uid: string,
    username: string,
  }
}

type CompanyFileCredentials = {
  username: string,
  password: string,
}

class MyobService {

  private readonly publicKey: string;
  private readonly privateKey: string;
  private readonly redirectUrl: string;

  private accessToken: any;

  constructor(apiPublicKey: string, privateKey: string, redirectUrl: string) {
    this.publicKey = apiPublicKey;
    this.privateKey = privateKey;
    this.redirectUrl = redirectUrl;
  }

  async generateTokens(accessCode: string) {
    const reqBody = new URLSearchParams({
                                          'client_id': this.publicKey,
                                          'client_secret': this.privateKey,
                                          'scope': 'CompanyFile',
                                          'code': accessCode,
                                          'redirect_uri': this.redirectUrl,
                                          'grant_type': 'authorization_code',
                                        });

    const authResp = await this.sendAuthorisationPostReq(reqBody);
    this.accessToken = authResp['access_token'];

    return authResp as GeneratedToken;
  }

  async refreshAccessToken(refreshToken: string) {
    const reqBody = new URLSearchParams({
                                          'client_id': this.publicKey,
                                          'client_secret': this.privateKey,
                                          'refresh_token': refreshToken,
                                          'grant_type': 'refresh_token',
                                        });

    const authResp = await this.sendAuthorisationPostReq(reqBody);
    this.accessToken = authResp['access_token'];
    const newRefreshToken = authResp['refresh_token'];

    return {
      access_token: this.accessToken,
      refresh_token: newRefreshToken,
    };
  }

  /**
   * Returns the OAuth 2.0 link that a user needs to be redirected to in order to link their MYOB account with their
   * kache account (determined by `userId`).
   */
  generateOAuthLink(userId: string): string {
    const urlEncoded = encodeURIComponent(this.redirectUrl);
    return `${MYOB_OAUTH_URL}?client_id=${this.publicKey}&redirect_uri=${urlEncoded}&response_type=code&scope=CompanyFile&state=${userId}`;
  }

  /**
   * Returns a list of company files.
   */
  async getCompanyFiles() {
    const resp = await this.makeDomainApiCall(AR_BASE_URL, 'GET');

    if (resp.status == 200) {
      return await resp.json();
    } else {
      return null;
    }
  }

  async getCFUriFromCFId(cfId: string) {
    const resp = await this.makeDomainApiCall(AR_BASE_URL, 'GET');
    const files = await resp.json() as any[];

    return files.find((file) => file['Id'] === cfId)?.Uri;
  }

  async getTaxCodeUid(cfUri): Promise<string> {
    const taxCodeResp = await this.makeCFApiCall(`${cfUri}/GeneralLedger/TaxCode`, 'GET');
    const taxCodeObject = (await taxCodeResp.json())['Items'].find((taxCode) => taxCode['Code'] === 'N-T');
    return taxCodeObject['UID'];
  }

  /**
   * Gets the currently authenticated user.
   */
  async getAuthenticatedUser() {
    const validateResp = await this.makeDomainApiCall('https://secure.myob.com/oauth2/v1/Validate?scope=CompanyFile', 'GET');

    const user = await validateResp.json();

    return {
      myobId: user['Uid'],
      username: user['username'],
    };
  }


  /**
   * Sends a POST request to MYOB's authorize endpoint.
   */
  private async sendAuthorisationPostReq(body: URLSearchParams) {
    return await (await fetch(MYOB_AUTHORISE_URL, { method: 'POST', body: body })).json();
  }

  async makeDomainApiCall(uri: string, method: string) {
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'x-myobapi-key': this.publicKey,
      'x-myobapi-version': 'v2',
    };

    return await fetch(uri, { headers, method: method });
  }

  /**
   * Makes an API call to `uri` with the `username` and `password` of the company file.
   */
  async makeCFApiCall(uri: string, method: string, cfCredentials: CompanyFileCredentials = null, body?: object) {

    const credentials = cfCredentials ?? MyobService.getDefaultCFCredentials();

    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      // Encode in base 64
      'x-myobapi-cftoken': Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64'),
      'x-myobapi-key': this.publicKey,
      'x-myobapi-version': 'v2',
    };

    return await fetch(uri, { headers, method: method, ...(body && { body: JSON.stringify(body) }) });
  }

  /**
   * Returns the default Company File credentials.
   */
  static getDefaultCFCredentials() {
    return {
      username: 'Administrator',
      password: '',
    };
  }

}

export {
  MyobService,
};
