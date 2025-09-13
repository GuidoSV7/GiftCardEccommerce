// Tipos para Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: GoogleIdConfiguration) => void;
                    prompt: (callback?: (notification: PromptMomentNotification) => void) => void;
                    renderButton: (element: HTMLElement, config: GsiButtonConfiguration) => void;
                    disableAutoSelect: () => void;
                    storeCredential: (credential: CredentialResponse, callback?: () => void) => void;
                    cancel: () => void;
                    onGoogleLibraryLoad: () => void;
                    revoke: (hint: string, callback: (done: RevocationResponse) => void) => void;
                };
            };
        };
    }
}

export interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    state_cookie_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: () => void;
    itp_support?: boolean;
    login_uri?: string;
    native_callback?: (response: CredentialResponse) => void;
    nonce?: string;
    prompt_parent_id?: string;
    redirect_uri?: string;
    select_by?: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'brn_add_session' | 'btn_confirm_add_session';
    state?: string;
    error_callback?: (error: any) => void;
}

export interface CredentialResponse {
    credential: string;
    select_by: string;
    client_id: string;
}

export interface PromptMomentNotification {
    isDisplayMoment: () => boolean;
    isDisplayed: () => boolean;
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () => string;
    isSkippedMoment: () => boolean;
    getSkippedReason: () => string;
    isDismissedMoment: () => boolean;
    getDismissedReason: () => string;
    getMomentType: () => string;
}

export interface GsiButtonConfiguration {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
    locale?: string;
}

export interface RevocationResponse {
    successful: boolean;
    error?: string;
}

// Tipos para el payload del JWT de Google
export interface GoogleJWTPayload {
    iss: string;
    nbf: number;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    azp: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
    jti: string;
}

// Tipos para la respuesta de autenticación
export interface GoogleAuthResponse {
    success: boolean;
    data: {
        id: string;
        email: string;
        roles: string;
        token: string;
        adminData?: any;
        isNewUser?: boolean;
    };
    message: string;
}

// Tipos para errores de Google Auth
export interface GoogleAuthError {
    error: string;
    error_description?: string;
    details?: string;
}
