import { Button, TextField } from "@material-ui/core";
import * as React from "react";

export interface IProps {
  classLevel: number;
  num: number;
  questions: any[];
  story: string[];
  title: string;
  type: string;

  onChange: (event: any) => void;
  onSave: () => void;
}

export default class Story extends React.Component<IProps> {
  public render() {
    const { classLevel, num, story, onChange, onSave } = this.props;

    return (
      <div>
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Number"
          type="number"
          value={num}
          name="num"
          onChange={onChange}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Class Level"
          type="number"
          value={classLevel}
          name="classLevel"
          onChange={onChange}
        />
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Story"
          multiline={true}
          name="story"
          value={story.join("\n")}
          onChange={onChange}
        />
        <Button onClick={onSave}>Save</Button>
      </div>
    );
  }
}
