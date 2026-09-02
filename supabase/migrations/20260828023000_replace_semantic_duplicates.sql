-- Sustituye dos duplicados semánticos históricos conservando sus IDs y, por
-- tanto, la asignación inmutable ya publicada para Aventura v1.
begin;

update public.questions set
  question = '¿Qué artista creó la instalación “The Weather Project” en la Tate Modern?',
  options = '["Olafur Eliasson", "Anish Kapoor", "Ai Weiwei", "Bill Viola"]'::jsonb,
  answer_index = 0,
  context = 'Olafur Eliasson llenó la Turbine Hall de la Tate Modern con luz, niebla y un enorme sol artificial en 2003.',
  difficulty = 'hard',
  question_en = 'Which artist created the installation The Weather Project at Tate Modern?',
  options_en = '["Olafur Eliasson", "Anish Kapoor", "Ai Weiwei", "Bill Viola"]'::jsonb,
  context_en = 'Olafur Eliasson filled Tate Modern’s Turbine Hall with light, mist and an enormous artificial sun in 2003.'
where id = 'c275b8ad-93ab-457f-a4d9-a08552ef878a'
  and question = '¿Quién pintó "Las señoritas de Avignon" (1907)?';

update public.questions set
  question = '¿Qué filósofa escribió “La condición humana”?',
  options = '["Hannah Arendt", "Simone Weil", "Edith Stein", "Judith Butler"]'::jsonb,
  answer_index = 0,
  context = 'Hannah Arendt publicó “La condición humana” en 1958 y analizó en ella la labor, el trabajo y la acción.',
  difficulty = 'medium',
  question_en = 'Which philosopher wrote The Human Condition?',
  options_en = '["Hannah Arendt", "Simone Weil", "Edith Stein", "Judith Butler"]'::jsonb,
  context_en = 'Hannah Arendt published The Human Condition in 1958, examining labour, work and action.'
where id = '1353a10c-0a19-4791-9f97-96cbb3727b21'
  and question = '¿Qué obra escribió Tomás Moro en latín en 1516?';

do $$
begin
  if not exists (
    select 1 from public.questions
    where id = 'c275b8ad-93ab-457f-a4d9-a08552ef878a'
      and question = '¿Qué artista creó la instalación “The Weather Project” en la Tate Modern?'
      and question_en = 'Which artist created the installation The Weather Project at Tate Modern?'
  ) or not exists (
    select 1 from public.questions
    where id = '1353a10c-0a19-4791-9f97-96cbb3727b21'
      and question = '¿Qué filósofa escribió “La condición humana”?'
      and question_en = 'Which philosopher wrote The Human Condition?'
  ) then
    raise exception 'Semantic duplicate replacement did not update exactly the expected rows';
  end if;
end $$;

commit;
