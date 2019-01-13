import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import classNames from "classnames";
import * as moment from "moment";
import * as React from "react";

import * as vhub from "../modules/vhub";

interface Props {
  classes: any;
  task: vhub.ITask;
}

const styles = () =>
  createStyles({
    subc: {
      color: "rgb(160, 160, 160)",
    },
    time: {
      padding: "2px",
      borderRadius: "2px",
    },
    footer: {
      display: "flex",
    },
    rightFooter: {
      marginLeft: "auto",
    },
    importanceCircle: {
      height: "16px",
      width: "16px",
      borderRadius: "50%",
    },
    pastDue: {
      color: "white",
      backgroundColor: "#f67280",
    },
  });

class Task extends React.Component<Props> {
  public deadlineComponent = () => {
    const { task, classes } = this.props;

    if (task.deadline.isBefore(moment())) {
      return (
        <Card className={classNames(classes.time, classes.pastDue)}>
          <Typography variant="caption" className={classes.footer}>
            <AccessTimeIcon />
            <span>{task.deadline.fromNow()}</span>
          </Typography>
        </Card>
      );
    } else {
      return (
        <Typography variant="caption" className={classes.footer}>
          <AccessTimeIcon />
          <span>{task.deadline.fromNow()}</span>
        </Typography>
      );
    }
  };

  public render() {
    const { task, classes } = this.props;

    return (
      <Grid item={true} xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography className={classes.subc} variant="caption">
              <i>
                {task.subcommittees.map(vhub.subcommitteeString).join(", ")}
              </i>
            </Typography>
            <Typography variant="subtitle1">{task.title}</Typography>
            {task.description ? (
              <Typography
                color="textSecondary"
                gutterBottom={true}
                variant="body1"
              >
                {task.description}
              </Typography>
            ) : (
              ""
            )}
          </CardContent>
          <CardActions className={classes.footer}>
            {this.deadlineComponent()}
            <Card
              className={classNames(
                classes.rightFooter,
                classes.importanceCircle
              )}
              style={vhub.importanceStyle(task.importance)}
            />
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Task);
