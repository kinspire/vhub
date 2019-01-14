import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Chip from "@material-ui/core/Chip";
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
      color: "#E87B62",
      // backgroundColor: "#fcdccf",
      // margin: "0 2px",
      // color: "rgb(160, 160, 160)",
    },
    timeCard: {
      padding: "2px",
      borderRadius: "2px",
    },
    timeElement: {
      // TODO change this and other margins to flex-gaps? Idk if that's a thing
      margin: "2px",
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
    volunteerCircle: {
      margin: "0 2px",
      height: "24px",
      width: "24px",
      borderRadius: "50%",
      border: "1px solid black",
      fontSize: "12px",
      lineHeight: "24px",
      textAlign: "center",
    },
    pastDue: {
      color: "white",
      backgroundColor: "#f67280",
    },
  });

// TODO add tooltips everywhere

class Task extends React.Component<Props> {
  public deadlineComponent = () => {
    const { task, classes } = this.props;

    const content = (
      <Typography variant="caption" className={classes.footer}>
        <AccessTimeIcon className={classes.timeElement} />
        <span className={classes.timeElement}>
          {vhub.deadlineString(task.deadline)}
        </span>
      </Typography>
    );

    if (task.deadline.isBefore(moment())) {
      return (
        <Card className={classNames(classes.timeCard, classes.pastDue)}>
          {content}
        </Card>
      );
    }
    return content;
  };

  public render() {
    const { task, classes } = this.props;

    // Outdated Chip code
    //             {task.subcommittees.map(vhub.subcommitteeString).map(s => (
    //   <Chip
    //     className={classes.subc}
    //     label={
    //       <Typography variant="caption">
    //         <i>{s}</i>
    //       </Typography>
    //     }
    //   />
    // ))}

    const subc = (
      <header className={classes.footer}>
        <Typography variant="caption" className={classes.subc}>
          <i>{task.subcommittees.map(vhub.subcommitteeString).join(", ")}</i>
        </Typography>
        <Card
          className={classNames(classes.rightFooter, classes.importanceCircle)}
          style={vhub.importanceStyle(task.importance)}
        />
      </header>
    );

    return (
      <Grid item={true} xs={12} md={6}>
        <Card>
          <CardContent>
            {subc}
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
            <span className={classNames(classes.footer, classes.rightFooter)}>
              {task.volunteers.map(v => (
                <Card className={classes.volunteerCircle} key={v.name}>
                  {vhub.volunteerInitials(v)}
                </Card>
              ))}
            </span>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(Task);
