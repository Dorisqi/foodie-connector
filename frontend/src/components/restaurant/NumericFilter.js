import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';

const styles = theme => ({
  numericFilter: {
    boxSizing: 'border-box',
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.23)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '7px 8px',
    height: 35,
    marginTop: theme.spacing.unit / 2,
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit / 2,
  },
  numericFilterActive: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.light,
  },
  textFieldWrapper: {
    color: 'inherit',
  },
  textField: {
    color: 'inherit',
    fontSize: '0.8125rem',
    padding: '0 5px',
    width: 20,
    textAlign: 'center',
  },
  typography: {
    color: 'inherit',
    fontSize: '0.8125rem',
  },
});

class NumericFilter extends React.Component {
  handleInputChange = type => (e) => {
    const numericValue = parseInt(e.target.value, 10);
    this.props.onChange(type, Number.isNaN(numericValue) ? null : numericValue);
  }

  render() {
    const { classes, label, value } = this.props;
    const active = value.min !== null || value.max !== null;
    return (
      <div className={active
        ? classNames(classes.numericFilter, classes.numericFilterActive)
        : classes.numericFilter}
      >
        <Typography className={classes.typography} variant="button" component="span">
          {label}
        </Typography>
        <Input
          className={classes.textFieldWrapper}
          classes={{
            input: classes.textField,
          }}
          placeholder="0"
          value={value.min === null ? '' : value.min}
          onChange={this.handleInputChange('min')}
          disableUnderline
        />
        <Typography className={classes.typography} variant="button" component="span">
          to
        </Typography>
        <Input
          className={classes.textFieldWrapper}
          classes={{
            input: classes.textField,
          }}
          placeholder="&infin;"
          value={value.max === null ? '' : value.max}
          onChange={this.handleInputChange('max')}
          disableUnderline
        />
      </div>
    );
  }
}

NumericFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(NumericFilter);
