declare module 'react-facebook-login' {
  import { Component } from 'react';

  interface ReactFacebookLoginProps {
    appId: string;
    callback(userInfo: {
      accessToken: string;
      userID: string;
      name: string;
      email: string;
      picture?: {
        data: {
          url: string;
        };
      };
    }): void;
    onFailure?(response: any): void;
    autoLoad?: boolean;
    fields?: string;
    cssClass?: string;
    size?: 'small' | 'medium' | 'metro';
    textButton?: string;
    icon?: string;
    language?: string;
    isDisabled?: boolean;
    redirectUri?: string;
    scope?: string;
    returnScopes?: boolean;
    responseType?: string;
    xfbml?: boolean;
    isMobile?: boolean;
    disableMobileRedirect?: boolean;
    authType?: string;
    version?: string;
  }

  export default class ReactFacebookLogin extends Component<ReactFacebookLoginProps> {}
} 