import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import * as vhub from "../modules/vhub";

interface Props {
  task: vhub.ITask;
}

export default class Task extends React.Component<Props> {
  public render() {
    const { task } = this.props;

    return (
      <Grid item={true} xs={12} md={6}>
        <Card>
          <CardContent>
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
          <CardActions>
            <Typography variant="caption">
              <i>
                {task.subcommittees.map(vhub.subcommitteeString).join(", ")}
              </i>
              &mdash;
              <b>{task.deadline.fromNow()}</b>
              &mdash;
              <i>{vhub.progressString(task.progress)}</i>
              &mdash;
              <b>{vhub.importanceString(task.importance)}</b>
            </Typography>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}
