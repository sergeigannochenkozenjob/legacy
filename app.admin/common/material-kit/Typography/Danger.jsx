import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import typographyStyle from './styles.jsx';

function Danger({ ...props }) {
    const { classes, children } = props;
    return (
        <div className={classes.defaultFontStyle + ' ' + classes.dangerText}>
            {children}
        </div>
    );
}

Danger.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(typographyStyle)(Danger);
