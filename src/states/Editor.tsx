import { Action } from 'redux';
import { IProcedureEditor } from '../models';

export interface IState {
    editor: IProcedureEditor;
    // executor: ;
    proceduresBuiltin: string[];
    procedures: string[];
}
