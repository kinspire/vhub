import { Button, TextField } from "@material-ui/core";
import * as React from "react";

export interface IProps {
  classLevel: number;
  num: number;
  questions: any[];
  story: string[];
  title: string;
  type: string;

  onAddParagraph: () => void;
  onDeleteParagraph: (i: number) => void;
  onChange: (event: any) => void;
  onSave: () => void;
}

export default class Story extends React.Component<IProps> {
  public render() {
    const {
      classLevel,
      num,
      questions,
      story,
      onAddParagraph,
      onDeleteParagraph,
      onChange,
      onSave,
    } = this.props;

    const questionViews = (
      <div>
        Questions:
        {questions.map((q, i) => {
          switch (q.type) {
            case "short":
              return (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="Story"
                  multiline={true}
                  name={`questions[${i}].question`}
                  value={q.question}
                  onChange={onChange}
                />
              );
            case "mcq":
              return;
            case "long":
              return (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  label="Story"
                  multiline={true}
                  name="story"
                  value={story.join("\n")}
                  onChange={onChange}
                />
              );
            default:
              return "Invalid question type";
          }
        })}
      </div>
    );

    const paragraphViews = (
      <div>
        Paragraphs
        {story.map((p, i) => (
          <div>
            <TextField
              multiline={true}
              name={`story[${i}]`}
              value={p}
              onChange={onChange}
            />
            <Button onClick={onDeleteParagraph.bind(null, i)}>
              Delete Paragraph
            </Button>
          </div>
        ))}
        <Button onClick={onAddParagraph}>Add Paragraph</Button>
      </div>
    );

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
        {paragraphViews}
        {questionViews}
        <Button onClick={onSave}>Save</Button>
      </div>
    );
  }
}
