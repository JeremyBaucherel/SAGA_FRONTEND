/**
 * Helper functions for interacting with the Redux store.
 */

import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import * as Api from './api';
import {assign} from 'es6-object-assign';
(window as any).store = null;

export interface IMe extends Api.IMe {
    hasAuthorization (authName: string): boolean;
}

export class User {
    nom: string;
    prenom: string;
    autorisations: string[];
    connecte: boolean;
    logon: string | null;
    rgpd_date: Date | null;
    url: string;

    constructor (jsonUser: IMe) {
        this.nom = jsonUser.nom;
        this.prenom = jsonUser.prenom;
        this.autorisations = jsonUser.autorisations;
        if (jsonUser.logon) {
            this.logon = jsonUser.logon;
        } else {
            this.logon = null;
        }
        this.rgpd_date = jsonUser.rgpd_date;
        this.url = jsonUser.url;
        this.connecte = jsonUser.connecte;
    }

    static make (jsonUser: IMe): User | null {
        if (jsonUser) {
            return new User(jsonUser);
        } else {
            return null;
        }
    }

    static makeJsonUser(): Api.IMe {
        return {
            id: 0,
            nom: 'ANONYME',
            prenom: 'Utilisateur',
            logon: 'anonyme',
            connecte: false,
            autorisations: [],
            sso_idp: '',
        };
    }

    hasAuthorization (authorizationName: string): boolean {
        return this.autorisations.indexOf(authorizationName) != -1;
    }
}

export function get () {
    if ((window as any).store === null || (window as any).store === undefined) {
        (window as any).store = create();
    }
    return (window as any).store;
}

export function dispatchUserSignIn (user: IMe) {
    get().dispatch({
        'type': 'USER_SIGN_IN',
        'user': user,
    });
}

export function dispatchUserSignOut (user: IMe) {
    get().dispatch({
        'type': 'USER_SIGN_OUT',
        'user': user,
    });
}

export function dispatchUserUpdate (user: Api.IMe) {
    get().dispatch({
        type: 'USER_UPDATE',
        user: user
    });
}

export function create() {
    return Redux.createStore(_updateStore, {user: undefined});
}

export function _updateStore(state = {}, action: any): any | null{
    var newState = null;

    switch (action.type){
        case 'USER_SIGN_IN':
            let signedInUser = User.make(action.user);
            newState = assign({}, state, {user: signedInUser});
            break;

        case 'USER_SIGN_OUT':
            let signedOutUser = User.make(action.user);
            newState = assign({}, state, {user: signedOutUser});
            break;

        case 'USER_UPDATE':
            let updatedUser = User.make(action.user);
            newState = assign({}, state, {user: updatedUser});
            break;

        default:
            newState = assign({}, state)
    }
    return newState;
};


export interface withStoreProps {
    user: User | null;
}

export function withStore(cls: any): any {
    return ReactRedux.connect(
        (state: any) => {
            return {
                user: User.make(state.user)
            };
        }
    )(cls);
}