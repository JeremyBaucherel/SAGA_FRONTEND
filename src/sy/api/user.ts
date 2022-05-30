import * as Common from './common';

export interface IMeResponse extends Common.IResponse {
    body: IMe;
}

export interface IMe {
    active: boolean;
    id: number;
    nom: string;
    prenom: string;
    autorisations: string[];
    connecte: boolean;
    logon?: string;
    rgpd_date: Date | null;
    url: string;
}

export interface IUserResponse extends Common.IResponse {
    body: IUser;
}

export interface IUser {
    nom: string;
    prenom: string;
    active: boolean;
    logon: string;
}

export interface IUserRolesResponse extends Common.IResponse {
    body: IUserRole[];
}

export interface IUserGammesResponse extends Common.IResponse {
    body: IUserGamme[];
}

export interface IUserRole {
    id: number;
    nom: string;
    description: string;
    autorisations: IUserRoleAuthorization[];
}

export interface IUserGamme {
    id: number;
    gamme: string;
    cptgrgamme: string;
    description: string;
}

export interface IUserRoleAuthorization {
    nom: string;
    description: string;
}


export interface IUserTeam {
    nom: string;
    id: number;
    url: string;
}

export interface IUserTeamsResponse extends Common.IResponse<any> {
    body: IUserTeam[];
}

export function acceptMeRgpd (okCallback: {(response: any): void}, nokCallback: {(response: any): void}): void {
    let url = new Common.Url(['api', 'moi', 'rgpd']);
    Common.postAsJson(url, {}, okCallback, nokCallback);
}

/**
 * Fetch the user details for the current user.
 *
 * This request always returns a user, even if the user is not logged in. In that case, an anonymous user is returned.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getMe (okCallback: {(resp: IMeResponse): void}, nokCallback: {(resp: IMeResponse): void}): void {
    let url = new Common.Url(['api', 'moi']);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Get a user detail informations.
 * @param userLogon User logon (ex NT12345).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getUser (userLogon: string, okCallback: {(resp: IUserResponse): void}, nokCallback: {(resp: IUserResponse): void}): void {
    let url = new Common.Url(['api', 'utilisateurs', userLogon]);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Fetch the team a user belongs to.
 * @param userLogon User logon (ex NT12345).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getUserCatalogues (userLogon: string, okCallback: {(resp: IUserTeamsResponse): void}, nokCallback: {(resp: IUserTeamsResponse): void}): void {
    let url = new Common.Url(['api', 'utilisateurs', userLogon, 'catalogues']);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Fetch the roles a given user has.
 * @param userLogon User logon (ex NT12345).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getUserRoles (userLogon: string, okCallback: {(resp: IUserRolesResponse): void}, nokCallback: {(resp: IUserRolesResponse): void}): void {
    let url = new Common.Url(['api', 'utilisateurs', userLogon, 'autorisations']);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Fetch the gammes a given user has.
 * @param userLogon User logon (ex NT12345).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
 export function getUserGammes (userLogon: string, okCallback: {(resp: IUserRolesResponse): void}, nokCallback: {(resp: IUserRolesResponse): void}): void {
    let url = new Common.Url(['api', 'utilisateurs', userLogon, 'autorisationsgammes']);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Fetch all existing roles.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function getRoles (okCallback: Common.Callback, nokCallback: Common.Callback): void {
    let url = new Common.Url(['api', 'utilisateurs', 'roles']);
    Common.getJson(url, okCallback, nokCallback);
}

export function getGammes (okCallback: Common.Callback, nokCallback: Common.Callback): void {
    let url = new Common.Url(['api', 'utilisateurs', 'gammes']);
    Common.getJson(url, okCallback, nokCallback);
}

/**
 * Request a password request for a given user. This will send an confirmation e-mail to this user.
 * @param userLogon User logon (ex NT12345).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function requestUserPasswordReset(userLogon: string, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    let url = new Common.Url(['api', 'utilisateurs', 'reinitialiser-mdp']);
    let data = {logon: userLogon};
    Common.postAsJson(url, data, okCallback, nokCallback);
}

/**
 * Reset a user password given its logon and a password token.
 *
 * The password token is sent to the user when a call to `requestUserPasswordReset` is made.
 * @param userLogon User logon (ex NT12345).
 * @param passwordToken A random string provided by e-mail after a call to `requestUserPasswordReset`.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function resetUserPassword(userLogon: string, passwordToken: string, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.postAsJson(new Common.Url(['api', 'utilisateurs', userLogon, 'reinitialiser-mdp']),
        {passwordToken: passwordToken},
        okCallback,
        nokCallback);
}

/**
 * Request for the activation of a user account.
 * @param userLogon User logon (ex NT12345).
 * @param activationToken An random string provided to the user by e-mail after the creation of his account.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function requestInitUser (userLogon: string, activationToken: string, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.getJson(new Common.Url(['api', 'utilisateurs', userLogon], {activation_token: activationToken}),
        okCallback,
        nokCallback);
}

/**
 * Initialize a user account with a password.
 * @param userLogon User logon (ex NT12345).
 * @param sessionId Session ID.
 * @param password User password.
 * @param passwordBis Password repeated (must be the same as `password`).
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function initUser (userLogon: string, sessionId: string, password: string, passwordBis: string, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.postAsJson(new Common.Url(['api', 'utilisateurs', userLogon, 'initialiser']),
        {
            password: password,
            passwordBis: passwordBis,
            sessionId: sessionId
        },
        okCallback,
        nokCallback);
}

/**
 * Sign an anonymous user in.
 * @param userLogon User logon (ex NT12345).
 * @param password Non hashed password string.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function signIn (userLogon: string, password: string, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.postAsJson(new Common.Url(['api', 'utilisateurs', 'connexion']),
        {
            logon: userLogon,
            password: password
        },
        okCallback,
        nokCallback);
}

/**
 * Sign a logged in user out.
 * @param okCallback Function to call if the call is successfull.
 * @param nokCallback Function to call if the call is unsuccessfull.
 */
export function signOut (okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.postAsJson(new Common.Url(['api', 'utilisateurs', 'deconnexion']),
        {},
        okCallback,
        nokCallback);
}

export function updateUser(userData: any, okCallback: Common.Callback, nokCallback: Common.Callback): void {
    Common.postAsJson(new Common.Url(['api', 'utilisateurs', userData.logon, 'modifier']),
        userData,
        okCallback,
        nokCallback);
}