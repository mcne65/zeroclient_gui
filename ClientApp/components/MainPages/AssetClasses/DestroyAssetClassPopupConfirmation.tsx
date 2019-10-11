import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import t from '../../Language/Language'
import * as statics from '../../Global/statics'
import { TrueFalseIcon } from "../../Global/TrueFalseIcon"
import * as api from '../../Global/API'
import { Asset, asset_command, AssetClass } from '../_Interfaces/Assets'
import { Modal } from 'react-bootstrap'
import { AssetClasses } from './AssetClasses';
import { InfoPopup } from '../../Global/InfoPopup'
import { result, blank_result } from '../_Interfaces/iResult'
interface Props {
    class: AssetClass
    command: asset_command

    cancel_callback: any;
    continue_callback: any;
    language: number;
}
interface State {
    encoding_result: result;
}
export class DestroyAssetClassPopupConfirmation extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            encoding_result: blank_result
        };

        const body = JSON.stringify({
            command: this.props.command,
        })

        api.EncodeNewAssetCommand(body, (data: any) => { this.setState({ encoding_result: data }); })
    }
    //required for security, set pass to null

    Should_show(st: string): boolean {
        if (typeof (st) == 'string' && st.length > 0)
            return true;

        return false
    }

    render() {
        if (!this.state.encoding_result.sucess) {
            return <InfoPopup title={'Error'} info={this.state.encoding_result.message} close_callback={this.props.cancel_callback} show_popup={true} language={this.props.language} />
        }

        return (<Modal show={true} onHide={() => { }}>
            <Modal.Header closeButton>
                <Modal.Title>Please Ensure you want to destroy the following asset!</Modal.Title>

            </Modal.Header>
            <Modal.Body>

                <span>Destroy Asset</span>
                <dl className="dl-horizontal">
                    <dt>Asset Name :</dt> <dd>{this.props.class.class_name}</dd>
                    <dt>Asset Description :</dt> <dd>{this.props.class.class_description}</dd>
                    <dt>Asset ID :</dt> <dd>{this.props.class.txid}</dd>
                    <dt>Asset Action:</dt> <dd>Testroy</dd>

                </dl>

                <span></span>

                <h4>The cost for this operation is {this.state.encoding_result.cost} Radium. Are you sure?</h4>

            </Modal.Body>
            <Modal.Footer>
                <div className="btn-toolbar" role="group" aria-label="...">
                    <button type="button" className="btn btn-default btn-danger" onClick={() => {
                        this.props.cancel_callback()
                    }}>Close</button>

                    <button type="button" className="btn btn-default btn-success" onClick={() => {
                        this.props.continue_callback(this.state.encoding_result)
                    }}>Destroy</button>
                </div>
            </Modal.Footer>
        </Modal>

        );
    }
}
