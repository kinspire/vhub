import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as React from "react";

import palette from "../util/palette";

const styles = (theme: Theme) =>
  createStyles({
    arrow: {
      margin: "auto 0",
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 160,
    },
    header: {
      display: "flex",
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      color: theme.palette.text.secondary,
    },
    paperBackgroundColor: {
      backgroundColor: palette.bg.tasksPaper,
    },
    paperTitle: {
      paddingBottom: theme.spacing.unit,
      textAlign: "center",
    },
    paperEmpty: {
      padding: theme.spacing.unit * 2.5,
      textAlign: "center",
      // TODO italic
    },
  });

interface Props {
  classes: any;
}

class Tasks extends React.Component<Props, {}> {
  public render() {
    const { classes } = this.props;

    const leftHeader = (
      <span>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="committee">Committee</InputLabel>
          <Select
            inputProps={{
              name: "committee",
              id: "committee",
            }}
            value=""
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="projects">Projects</MenuItem>
            <MenuItem value="outreach">Outreach</MenuItem>
          </Select>
        </FormControl>
        <span className={classes.arrow}>
          <ChevronRightIcon />
        </span>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="subcommittee">Subcommittee</InputLabel>
          <Select
            inputProps={{
              name: "subcommittee",
              id: "subcommittee",
            }}
            value=""
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
          </Select>
        </FormControl>
      </span>
    );

    // const rightHeader = (
    //   <span>
    //     <FormControl className={classes.formControl}>
    //       <InputLabel htmlFor="view">View</InputLabel>
    //       <Select
    //         inputProps={{
    //           name: "view",
    //           id: "view",
    //         }}
    //         value=""
    //       >
    //         <MenuItem value="progress">Progress</MenuItem>
    //         <MenuItem value="due">Due</MenuItem>
    //       </Select>
    //     </FormControl>
    //   </span>
    // );

    const header = <header className={classes.header}>{leftHeader}</header>;

    const content = (
      <Grid container={true} spacing={24}>
        <Grid item={true} xs={6}>
          <ExpansionPanel
            className={classes.paperBackgroundColor}
            defaultExpanded={true}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">New</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12} md={6}>
                  <Card className={classes.card}>
                    <CardContent>
                      <Typography variant="h6">Task title</Typography>
                      <Typography color="textSecondary" gutterBottom={true}>
                        Task description
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">More</Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item={true} xs={6}>
          <ExpansionPanel
            className={classes.paperBackgroundColor}
            defaultExpanded={true}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">In Progress</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <Typography className={classes.paperEmpty} variant="h6">
                    No tasks!
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item={true} xs={12}>
          <ExpansionPanel className={classes.paperBackgroundColor}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Done</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails />
          </ExpansionPanel>
        </Grid>
      </Grid>
    );

    return (
      <div>
        {header}
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(Tasks);
