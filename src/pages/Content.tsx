import { firestore, Unsubscribe } from "firebase";
import * as _ from "lodash";
import * as log from "loglevel";
import * as React from "react";
import { Link } from "react-router-dom";

import * as fs from "../firebaseService";

export interface IState {
  content: Array<Array<Record<string, firestore.DocumentSnapshot>>>;
}

export default class Content extends React.Component<{}, IState> {
  private unregisterObserver: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      content: [],
    };
  }

  public componentDidMount() {
    this.unregisterObserver = fs
      .db()
      .collection("content")
      .onSnapshot(snapshot => {
        const contentBuckets: Array<
          Array<Record<string, firestore.DocumentSnapshot>>
        > = [];

        snapshot.docs.forEach(doc => {
          if (!contentBuckets[doc.get("classLevel")]) {
            contentBuckets[doc.get("classLevel")] = [];
          }
          const contentBucket: any[] = contentBuckets[doc.get("classLevel")];
          if (!contentBucket[doc.get("num")]) {
            contentBucket[doc.get("num")] = {};
          }
          const content: any = contentBucket[doc.get("num")];
          content[doc.get("type")] = doc;
        });
        this.setState({
          content: contentBuckets,
        });
      });
  }

  public componentWillUnmount() {
    this.unregisterObserver();
  }

  public render() {
    return (
      <div>
        Content:
        {this.state.content.map((bucket, classLevel) =>
          bucket ? (
            <div key={classLevel}>
              <h1>Class Level {classLevel}</h1>
              {bucket.map((coll, num) => {
                log.debug(coll);
                return coll ? (
                  <div key={num}>
                    <h2>Number {num}</h2>
                    <ul>
                      {_.map(coll, (c, i) => (
                        <li key={i}>
                          <Link to={`/editcontent/${c.id}`}>
                            {c.get("title")} &mdash; {c.get("type")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  ""
                );
              })}
            </div>
          ) : (
            ""
          )
        )}
      </div>
    );
  }
}
