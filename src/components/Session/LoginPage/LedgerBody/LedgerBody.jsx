import React from 'react';
import PropTypes from 'prop-types';
import Driver from '../../../../lib/Driver';
import LedgerLogo from './LedgerLogo/LedgerLogo';
import LedgerForm from './LedgerForm/LedgerForm';
import LedgerAlert from './LedgerAlert/LedgerAlert';
import LedgerSetupNotes from './LedgerSetupNotes/LedgerSetupNotes';
import LedgerSetupInstructions from './LedgerSetupInstructions/LedgerSetupInstructions';

export default class LedgerBody extends React.Component {
    static browserIsGoogleChrome() {
        // Checking for Google Chrome 1-71+ or Opera
        return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    }

    static browserU2FSupport() {
        // Checking for u2f support (for Firefox)
        return !!window.u2f;
    }

    static isHttpConnectionUsed() {
        return window.location.protocol === 'http:';
    }

    static isWindowsOS() {
        return (window.navigator.platform === 'Win32' || window.navigator.platform === 'Win64');
    }

    componentDidMount() {
        const isWindowsOS = this.constructor.isWindowsOS();
        if (!isWindowsOS) {
            this.brakePing = this.props.d.session.pingLedger();
        }
    }

    componentWillUnmount() {
        const isWindowsOS = this.constructor.isWindowsOS();
        if (!isWindowsOS) {
            this.brakePing();
        }
    }

    render() {
        const { d, modal } = this.props;
        const ledgerConnected = d.session.ledgerConnected;
        const isSupported = this.constructor.browserU2FSupport();
        const isNotChrome = !this.constructor.browserIsGoogleChrome();
        const isHttp = this.constructor.isHttpConnectionUsed();
        const isWindowsOS = this.constructor.isWindowsOS();
        let loginForm;

        if (isNotChrome && !isSupported) {
            loginForm = <LedgerAlert alertType={'useChrome'} />;
        } else if (isHttp) {
            loginForm = <LedgerAlert alertType={'useHttps'} />;
        } else if (!ledgerConnected) {
            loginForm = <LedgerAlert alertType={'searching'} isWindowsOS={isWindowsOS} d={d} />;
        } else if (ledgerConnected) {
            loginForm = <LedgerForm d={d} />;
        }

        if (modal) {
            return (
                <div className="LoginPage__greenBox">{loginForm}</div>
            );
        }

        return (
            <div className="LoginPage__body">
                <LedgerLogo />

                <div className="LoginPage__greenBox">{loginForm}</div>

                <div className="LoginBox__spacer">
                    <div className="LoginBox__divider" />
                </div>

                <LedgerSetupInstructions />
                <LedgerSetupNotes />
            </div>
        );
    }
}

LedgerBody.propTypes = {
    d: PropTypes.instanceOf(Driver),
    modal: PropTypes.bool,
};
