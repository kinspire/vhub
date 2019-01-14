import Checkbox from "@material-ui/core/Checkbox";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import { GridSize } from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as _ from "lodash";
import * as React from "react";

import Task from "../components/Task";
import * as vhub from "../modules/vhub";
import palette from "../util/palette";

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 160,
    },
    header: {
      display: "flex",
    },
    rightHeader: {
      marginLeft: "auto",
    },
    paper: {
      padding: theme.spacing.unit * 2,
      color: theme.palette.text.secondary,
    },
    panel: {
      backgroundColor: palette.bg.tasksPaper,
    },
    panelTitle: {
      // color: palette.fg.tasksPaper,
      fontFamily: "Alegreya Sans",
      textTransform: "uppercase",
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

interface State {
  selectedFilter: vhub.Subcommittee[];
  filters: vhub.Subcommittee[];
  selectedSort: vhub.Sort;
  tasks: vhub.ITask[];
}

class Tasks extends React.Component<Props, State> {
  public state = {
    selectedFilter: vhub.DEFAULT_FILTERS,
    filters: vhub.DEFAULT_FILTERS,
    selectedSort: vhub.DEFAULT_SORT,
    tasks: vhub.SAMPLE_TASKS,
  };

  public handleFilterSelect = (event: any) => {
    this.setState({
      selectedFilter: event.target.value,
    });
  };

  public handleSortSelect = (event: any) => {
    this.setState({
      selectedSort: event.target.value,
    });
  };

  public filterRenderValue = (selected: vhub.Subcommittee[]): string => {
    return selected.length !== this.state.filters.length
      ? selected.map(vhub.subcommitteeString).join(", ")
      : "All";
  };

  public getPanel(
    title: string,
    width: GridSize,
    tasks: vhub.ITask[],
    defaultExpanded = true
  ) {
    return (
      <Grid item={true} md={width}>
        <ExpansionPanel
          className={this.props.classes.panel}
          defaultExpanded={defaultExpanded}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={this.props.classes.panelTitle} variant="h6">
              {title}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container={true} spacing={8}>
              {tasks.map((task, i) => (
                <Task key={i} task={task} />
              ))}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
    );
  }

  // Filter current tasks by current filter
  public getFilteredTasks = () => {
    return this.state.tasks.filter(
      t =>
        _.without(t.subcommittees, ...this.state.selectedFilter).length !==
        t.subcommittees.length
    );
  };

  // TODO always filter out done before getting the view

  public getProgressView = (tasks: vhub.ITask[]) => {
    // Process tasks
    const taskSplit: Record<vhub.Progress, vhub.ITask[]> = {
      [vhub.Progress.DONE]: [],
      [vhub.Progress.NOT_STARTED]: [],
      [vhub.Progress.IN_PROGRESS]: [],
    };

    tasks.forEach(task => taskSplit[task.progress].push(task));

    return (
      <Grid container={true} spacing={24}>
        {this.getPanel("In Progress", 6, taskSplit[vhub.Progress.IN_PROGRESS])}
        {this.getPanel("Not Started", 6, taskSplit[vhub.Progress.NOT_STARTED])}
        {this.getPanel("Done", 12, taskSplit[vhub.Progress.DONE], false)}
      </Grid>
    );
  };

  public getDeadlineView = (tasks: vhub.ITask[]) => {
    // Process tasks
    const done = _.filter(tasks, t => t.progress === vhub.Progress.DONE);
    const taskSplit: Record<vhub.Deadline, vhub.ITask[]> = {
      [vhub.Deadline.OVERDUE]: [],
      [vhub.Deadline.THIS_WEEK]: [],
      [vhub.Deadline.LATER]: [],
    };

    // Organize
    tasks.forEach(task => {
      taskSplit[vhub.deadlineEnum(task.deadline)].push(task);
    });

    return (
      <Grid container={true} spacing={24}>
        {this.getPanel("Overdue", 12, taskSplit[vhub.Deadline.OVERDUE])}
        {this.getPanel("This Week", 12, taskSplit[vhub.Deadline.THIS_WEEK])}
        {this.getPanel("Later", 12, taskSplit[vhub.Deadline.LATER])}
        {this.getPanel("Done", 12, done, false)}
      </Grid>
    );
  };

  public getImportanceView = (tasks: vhub.ITask[]) => {
    // Process tasks
    const done = _.filter(tasks, t => t.progress === vhub.Progress.DONE);
    const taskSplit: Record<vhub.Importance, vhub.ITask[]> = {
      [vhub.Importance.HIGH]: [],
      [vhub.Importance.MEDIUM]: [],
      [vhub.Importance.LOW]: [],
    };

    // Organize
    tasks.forEach(task => {
      taskSplit[task.importance].push(task);
    });

    return (
      <Grid container={true} spacing={24}>
        {this.getPanel("High", 12, taskSplit[vhub.Importance.HIGH])}
        {this.getPanel("Medium", 12, taskSplit[vhub.Importance.MEDIUM])}
        {this.getPanel("Low", 12, taskSplit[vhub.Importance.LOW])}
        {this.getPanel("Done", 12, done, false)}
      </Grid>
    );
  };

  public render() {
    const { classes } = this.props;

    // TODO add an option for "only" - so when the filter is selected only that one is chosen
    // TODO Or also add a "None" option
    const leftHeader = (
      <span>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="filter">Filter</InputLabel>
          <Select
            multiple={true}
            value={this.state.selectedFilter}
            onChange={this.handleFilterSelect}
            input={<Input id="filter" />}
            renderValue={this.filterRenderValue}
          >
            {this.state.filters.map(filter => (
              <MenuItem key={filter} value={filter}>
                <Checkbox
                  checked={this.state.selectedFilter.indexOf(filter) > -1}
                />
                <ListItemText primary={vhub.subcommitteeString(filter)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </span>
    );

    const rightHeader = (
      <span className={classes.rightHeader}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="sort">Sort</InputLabel>
          <Select
            inputProps={{
              name: "sort",
              id: "sort",
            }}
            value={this.state.selectedSort}
            onChange={this.handleSortSelect}
          >
            <MenuItem value={vhub.Sort.PROGRESS}>Progress</MenuItem>
            <MenuItem value={vhub.Sort.DEADLINE}>Deadline</MenuItem>
            <MenuItem value={vhub.Sort.IMPORTANCE}>Importance</MenuItem>
          </Select>
        </FormControl>
      </span>
    );

    const header = (
      <header className={classes.header}>
        {leftHeader}
        {rightHeader}
      </header>
    );

    let content;
    switch (this.state.selectedSort) {
      case vhub.Sort.DEADLINE:
        content = this.getDeadlineView(this.getFilteredTasks());
        break;
      case vhub.Sort.PROGRESS:
        content = this.getProgressView(this.getFilteredTasks());
        break;
      case vhub.Sort.IMPORTANCE:
        content = this.getImportanceView(this.getFilteredTasks());
        break;
    }

    return (
      <div>
        {header}
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(Tasks);
