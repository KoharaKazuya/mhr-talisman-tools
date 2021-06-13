import classes from "./tweet-button.module.css";

type Props = {
  value: string;
};

export default function TweetButton({ value }: Props) {
  return (
    <a href={value} target="_blank" className={classes.button}>
      <img
        src="https://icongr.am/devicon/twitter-original.svg?size=16&color=currentColor"
        width="16"
        height="16"
        className={classes.icon}
      />
    </a>
  );
}
