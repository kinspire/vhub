import { createStyles, withStyles } from "@material-ui/core/styles";
import * as moment from "moment";
import * as React from "react";
import Calendar from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = Calendar.momentLocalizer(moment);
const styles = () =>
  createStyles({
    calendarContainer: {},
    calendar: {
      height: "100vh",
    },
  });

interface Props {
  classes: any;
}

class CalendarPage extends React.Component<Props> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.calendarContainer}>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          className={classes.calendar}
          events={[
            {
              start: new Date(),
              end: moment()
                .add(1, "days")
                .toDate(),
              title: "Some title",
            },
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CalendarPage);
