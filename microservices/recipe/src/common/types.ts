interface recipe {
  recipe_name: string;
  recipe_uuid: string;
  ingredients: [];

  steps: steps[];
  yields: amounts[];
  notes: string[];
}

interface ingredients {
  x_id: string;
  name: string;

  amounts: amounts[];
  processing: string[];
  notes: string[];
}

interface steps {
  step: string;
  notes: string;
}

interface amounts {
  amount: number;
  unit: string;
}

interface error {
  id: number;
  message: string;
}
