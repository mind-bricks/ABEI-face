import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    createStyles,
    makeStyles,
    useTheme,

    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Theme,
    Typography,
} from '@material-ui/core';
import {
    ChevronLeft,
    ChevronRight,
    ExpandMore,
    AccountTree,
} from '@material-ui/icons';

import {
    IProcedureID,
    IProcedureSite,
    IProcedureSiteService,
} from '../services';
import {
    EditorActions,
    LayoutActions,
    IState,
} from '../states';



interface ISidebarProps {
    // service
    procedureSiteService: IProcedureSiteService;

    // layout
    isSidebarShown: boolean;
    sidebarWidth: number;
    resizeSidebar: Function;
    showSidebar: Function;

    // editor
    procedures: { [key: string]: string[] };
    procedureSelected: IProcedureID | undefined;

    destroySite: Function;
    listProcedures: Function;
    selectProcedure: Function;
}

export const Sidebar = connect(
    (state: IState) => {
        return {
            procedureSiteService: state.service.procedureSiteService,
            isSidebarShown: state.layout.isSidebarShown,
            sidebarWidth: state.layout.sidebarWidth,
            procedures: state.editor.procedures,
            procedureSelected: state.editor.procedureSelected,
        };
    },
    {
        resizeSidebar: LayoutActions.resizeSidebar,
        showSidebar: LayoutActions.showSidebar,
        destroySite: EditorActions.destroySite,
        listProcedures: EditorActions.listProcedures,
        selectProcedure: EditorActions.selectProcedure,

    },
)((props: ISidebarProps) => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            drawer: {
                width: props.sidebarWidth,
                flexShrink: 0,
            },
            drawerPaper: {
                width: props.sidebarWidth,
                overflow: "hidden",
                // backgroundColor: theme.palette.primary.light,
                // zIndex: 0,
            },
            drawerHeader: {
                display: 'flex',
                alignItems: 'center',
                padding: theme.spacing(0, 1),
                justifyContent: 'flex-end',
                ...theme.mixins.toolbar,
            },
            accordion: {
                border: `1px solid ${theme.palette.primary.light}`,
                boxShadow: 'none',
            },
            accordionExpanded: {
                margin: '0 0 !important',
            },
            accordionSummary: {
                backgroundColor: 'rgba(0, 0, 0, .03)',
                borderBottom: `1px solid ${theme.palette.primary.main}`,
                marginBottom: -1,
                minHeight: 56,
            },
            accordionDetails: {
                padding: 0,
            },
            list: {
                width: "100%",
            },
            deleteIcon: {
                color: `${theme.palette.warning.main}`,
            }

        }),
    );

    const classes = useStyles();
    const theme = useTheme();
    const [
        procedureName,
        setProcedureName,
    ] = useState<string>('');
    const [
        procedureSite,
        setProcedureSite,
    ] = useState<IProcedureSite | undefined>(undefined);

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={props.isSidebarShown}
            className={classes.drawer}
            classes={{ paper: classes.drawerPaper }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={() => props.showSidebar(false)}>
                    {
                        theme.direction === 'ltr'
                            ? <ChevronLeft color="primary" />
                            : <ChevronRight color="primary" />
                    }
                </IconButton>
            </div>

            <Dialog
                open={procedureSite !== undefined}
                aria-labelledby="form-dialog-title"
                onClose={() => setProcedureSite(undefined)}
            >
                <DialogTitle id="form-dialog-title">
                    Create Procedure in Site {procedureSite?.signature}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Procedure Name"
                        type="text"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setProcedureName(event.target.value)}
                        value={procedureName}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setProcedureSite(undefined)}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={async () => {
                        if (procedureSite && procedureName) {
                            const procedure = await procedureSite.createProcedure(procedureName);
                            if (procedure) {
                                props.listProcedures({
                                    service: procedureSite
                                });
                                props.selectProcedure({
                                    site: procedureSite.signature,
                                    signature: procedureName,
                                });
                            }
                        }
                        setProcedureSite(undefined);
                    }} >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {[...Object.entries(props.procedures)].map((value, index, _) => (
                <Accordion
                    className={classes.accordion}
                    classes={{ expanded: classes.accordionExpanded }}
                    key={value[0]}
                    onChange={async (event: object, isExpanded: boolean) => {
                        if (isExpanded && !value[1].length) {
                            const site = await props.procedureSiteService.getSite(value[0]);
                            if (site) {
                                props.listProcedures({ service: site });
                            }
                        }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore color="primary" />}
                        className={classes.accordionSummary}
                    >
                        <Typography>{value[0]}</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        className={classes.accordionDetails}
                    >
                        <List className={classes.list}>
                            {value[1].map((signature, index) => (
                                <ListItem
                                    button
                                    selected={
                                        props.procedureSelected &&
                                        props.procedureSelected.site === value[0] &&
                                        props.procedureSelected.signature === signature
                                    }
                                    key={signature}
                                    onClick={async (event: React.MouseEvent<HTMLElement>) => {
                                        props.selectProcedure({ site: value[0], signature });
                                    }}
                                    draggable={true}
                                    onDragStart={(event: React.DragEvent<HTMLElement>) => {
                                        event.dataTransfer.setData(
                                            'dragProcedure',
                                            JSON.stringify({ site: value[0], signature }),
                                        );
                                    }}
                                >
                                    <ListItemIcon>
                                        <AccountTree color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={signature} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                        <Button
                            size="small"
                            color="primary"
                            onClick={async () => {
                                const site = await props.procedureSiteService.getSite(value[0]);
                                if (site) {
                                    setProcedureSite(site);
                                    setProcedureName('');
                                }
                            }}
                        >
                            Create Site Procedure
                        </Button>
                        <Button
                            size="small"
                            className={classes.deleteIcon}
                            onClick={async () => {
                                const site = await props.procedureSiteService.getSite(value[0]);
                                if (site) {
                                    props.destroySite({ service: site });
                                }
                            }}
                        >
                            Delete Site
                        </Button>
                    </AccordionActions>
                </Accordion>
            ))}
        </Drawer>
    );
});
