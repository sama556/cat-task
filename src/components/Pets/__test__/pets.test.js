
import { fireEvent, render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import catsMock from "../../../mocks/cats.json";
import Pets from "../Pets";
import userEvent from '@testing-library/user-event';

const server = setupServer(
  rest.get("http://localhost:4000/cats", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(catsMock));
  })
);

describe("Pets component", () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  beforeEach(() => {
    render(<Pets />);
  });

  test("it should render 5 cards", async () => {
    const elements = await screen.findAllByRole("article");
    expect(elements.length).toEqual(5);
  });

  test("it should render only 3 cards when gender is female", async () => {
    await userEvent.selectOptions(screen.getByLabelText(/gender/i), "female");
    const elements = await screen.findAllByRole("article");
    expect(elements.length).toEqual(3);
  });

  test("it should render only 1 card when favorite status is favoured", async () => {
    await userEvent.selectOptions(screen.getByLabelText(/favourite/i), "favoured");
    const elements = await screen.findAllByRole("article");
    expect(elements.length).toEqual(1);
  });

  test("it should render 4 cards when favorite status is not favoured", async () => {
    await userEvent.selectOptions(screen.getByLabelText(/favourite/i), "not favoured");
    const elements = await screen.findAllByRole("article");
    expect(elements.length).toEqual(4);
  });
});
