import TopBar from "Components/topBar";
import Hero from "./components/hero";
import CardInnovator from "Components/card/innovator";
import Container from "Components/container";
import { useQuery } from "react-query";
import { getUsers } from "Services/userServices";
import { paths } from "Consts/path";
import { useNavigate, generatePath } from "react-router-dom";
import { GridContainer } from "./_innovatorStyle";

function Innovator() {
  const navigate = useNavigate();
  const { data: users, isFetched } = useQuery<any>("innovators", getUsers);
  const innovators = users?.filter((item: any) => item.role === "innovator");

  return (
    <Container page>
      <TopBar title="Inovator" />
      <Hero />

      <p>This page is currently still in development.</p>

      {/* <GridContainer>
        {isFetched &&
          innovators?.map((item: any, idx: number) => (
            <CardInnovator
              key={idx}
              {...item}
              onClick={() =>
                navigate(
                  generatePath(paths.DETAIL_INNOVATOR_PAGE, { id: item.id })
                )
              }
            />
          ))}
      </GridContainer> */}
    </Container>
  );
}

export default Innovator;
