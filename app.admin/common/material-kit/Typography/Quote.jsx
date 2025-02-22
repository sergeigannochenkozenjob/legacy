import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
// core components
import typographyStyle from './styles.jsx';

function Quote({ ...props }) {
    const { classes, text, author } = props;
    return (
        <blockquote className={classes.defaultFontStyle + ' ' + classes.quote}>
            <p className={classes.quoteText}>{text}</p>
            <small className={classes.quoteAuthor}>{author}</small>
        </blockquote>
    );
}

Quote.propTypes = {
    classes: PropTypes.object.isRequired,
    text: PropTypes.node,
    author: PropTypes.node,
};

export default withStyles(typographyStyle)(Quote);
