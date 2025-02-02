import React, { Component } from 'react';

import DeliveryFailed from './DeliveryFailed';
import RecoveredToNormal from './RecoveredToNormal';
import SecondDelivery from './SecondDelivery'
import SelfPickup from './SelfPickup'

class TicketOperations extends Component {
    operations = {
        1: DeliveryFailed,
        2: RecoveredToNormal,
        4: SecondDelivery,
        3: SelfPickup
    };
    render() {
       const TagName = this.operations[this.props.tag || '1'];
       return this.props.tag!=='0'&&this.props.tag!==''&&<TagName 
       selfpickup_locate={this.props.selfpickup_locate} 
       second_arrival_scan_reasons={this.props.second_arrival_scan_reasons}
       second_arrival_scan_time={this.props.second_arrival_scan_time}
       second_arrival_scan_arrivalbatch={this.props.second_arrival_scan_arrivalbatch}
       scddelivery_fee={this.props.scddelivery_fee}
       scddelivery_addrnotes={this.props.scddelivery_addrnotes}
       scddelivery_drivernotes={this.props.scddelivery_drivernotes}
       scddelivery_buzzcode={this.props.scddelivery_buzzcode}
       scddelivery_feeAmount={this.props.scddelivery_feeAmount}
       onchange_selfpick={(val) => this.props.setSelfpickupLocate_general(val)}
       onchange_sndscanreasons={(val) => this.props.setSecondArrivalScanReasons_general(val)}
       onchange_sndscantime={(val) => this.props.setSecondArrivalScanTime_general(val)}
       onchange_sndscanarrivalbatch={(val) => this.props.setSecondArrivalScanArrivalbatch_general(val)}
       onchange_scddelivery_fee={(val) => this.props.setScddeliveryFee_general(val)}
       onchange_scddelivery_addrnotes={(val) => this.props.setScddeliveryAddrnotes_general(val)}
       onchange_scddelivery_drivernotes={(val) => this.props.setScddeliveryDrivernotes_general(val)}
       onchange_scddelivery_buzzcode={(val) => this.props.setScddeliveryBuzzcode_general(val)}
       onchange_scddelivery_feeAmount={(val) => this.props.setScddeliveryFeeAmount_general(val)}
       />
    }
}

export default TicketOperations;