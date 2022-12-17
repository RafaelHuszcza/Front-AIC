import styles from "./None.module.css";
import { Card, LayoutPage, Page } from "@furg/layout-react-lib";

export function None({ title }) {
  return (
    <LayoutPage>
      <Page title={title} subtitle="None">
        <Card>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, minus
          quidem quas dolorem minima perspiciatis. Praesentium neque molestias
          quaerat dignissimos debitis, nam numquam provident delectus repellat
          eius earum aperiam harum!
        </Card>
      </Page>
    </LayoutPage>
  );
}
