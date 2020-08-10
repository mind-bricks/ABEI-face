import { Action } from 'redux';
import {
    IProcedure,
    IProcedureService,
    IProcedureSite,
    IProcedureSiteService,
} from '../interfaces';

export interface IState {
    serviceOfProcedureSite: IProcedureSiteService;
    serviceOfProcedure: IProcedureService;
    procedureSites: Array<IProcedureSite>;
}

interface ICreateProcedureSite extends Action<'CREATE_PROCEDURE_SITE'> {
    signature: string;
    dependencies: Array<IProcedureSite>;
}

interface IDestroyProcedureSite extends Action<'DESTROY_PROCEDURE_SITE'> {
    procedureSite: IProcedureSite;
}

interface ICreateProcedure extends Action<'CREATE_PROCEDURE'> {
    signature: string;
    procedureSite: IProcedureSite;
}

interface IDestroyProcedure extends Action<'DESTROY_PROCEDURE'> {
    procedure: IProcedure;
}

interface IUpdateProcedure extends Action<'UPDATE_PROCEDURE'> {
    procedure: IProcedure;
}

