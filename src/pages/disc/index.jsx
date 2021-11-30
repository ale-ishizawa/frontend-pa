import { useState, useEffect } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Container,
  Typography,
  Grid,
  Card,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
import { makeStyles, styled } from '@material-ui/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { api } from '../../services/api';
import { MHidden } from '../../components/@material-extend';
import { getEmployees } from '../../services/employees';

const disc = [
  { D: 'Ousado', I: 'Ingênuo', S: 'Indiferente', C: 'Negativo' },
  { D: 'Trabalhador', I: 'Egoísta', S: 'Preocupado', C: 'Retraído' },
  { D: 'Auto-suficiente', I: 'Espirituoso', S: 'Satisfeito', C: 'Sensível' },
  { D: 'Energético', I: 'Brincalhão', S: 'Calmo', C: 'Persistente' },
  { D: 'Persuasivo', I: 'Sociável', S: 'Tranquilo', C: 'Controlador' },
  { D: 'Seguro', I: 'Espontâneo', S: 'Tímido', C: 'Organizado' },
  { D: 'Vigoroso', I: 'Engraçado', S: 'Amigável', C: 'Fiel' },
  { D: 'Impaciente', I: 'Inoportuno', S: 'Indeciso', C: 'Inseguro' },
  { D: 'Orgulhoso', I: 'Permissivo', S: 'Simples', C: 'Cauteloso' },
  { D: 'Mandão', I: 'Metido', S: 'Triste', C: 'Inflexível' },
  { D: 'Audacioso', I: 'Encantador', S: 'Diplomático', C: 'Minucioso' },
  { D: 'Habilidoso', I: 'Estimulante', S: 'Reservado', C: 'Respeitoso' },
  { D: 'Independente', I: 'Inspirado', S: 'Servidor', C: 'Idealista' },
  { D: 'Frio', I: 'Imprevisível', S: 'Desligado', C: 'Impopular' },
  { D: 'Positivo', I: 'Charmoso', S: 'Paciente', C: 'Planejador' },
  { D: 'Inflexível', I: 'Repetitível', S: 'Relutante', C: 'Ressentido' },
  { D: 'Competitivo', I: 'Convincente', S: 'Controlado', C: 'Atencioso' },
  { D: 'Indelicado', I: 'Tagarela', S: 'Tímido', C: 'Sensível' },
  { D: 'Aventureiro', I: 'Animado', S: 'Sereno', C: 'Ordeiro' },
  { D: 'Franco', I: 'Otimista', S: 'Mediador', C: 'Detalhista' },
  { D: 'Discutidor', I: 'Desorganizado', S: 'Incerto', C: 'Preocupado' },
  { D: 'Confiante', I: 'Alegre', S: 'Estável', C: 'Culto' },
  { D: 'Franco', I: 'Esquecido', S: 'Moroso', C: 'Complicado' },
  { D: 'Decidido', I: 'Demonstrativo', S: 'Tranquilo', C: 'Profundo' },
  { D: 'Obstinado', I: 'Convencido', S: 'Lento', C: 'Cético' },
  { D: 'Ativo', I: 'Desavergonhado', S: 'Mediador', C: 'Perfeito' },
  { D: 'Intolerante', I: 'Inconstante', S: 'Desligado', C: 'Introvertido' },
  { D: 'Insensível', I: 'Indisciplinado', S: 'Desinteressado', C: 'Rancoroso' },
  { D: 'Mandão', I: 'Desorganizado', S: 'Confuso', C: 'Chateado' },
  { D: 'Manipulador', I: 'Desordenado', S: 'Triste', C: 'Resmungão' }
];

const discDescriptions = {
  D: {
    title:
      'Você tem ênfase em atingir resultados, competitividade e confiança. Gosta de desafios e resultados imediatos.',
    description: `A pessoa Dominante tem ênfase em atingir resultados, competitividade e confiança.
    É direta, firme e toma iniciativa. Gosta de desafios e resultados imediatos.
    Corre riscos e busca resolver problemas. Decisivo, independente e egocêntrico.
    Relacionado a: Controle e poder.`
  },
  I: {
    title:
      'Você tem ênfase em influenciar e persuadir outros. Gosta de trabalhar em equipe, de compartilhar e motivar os outros.',
    description: `A pessoa influente costuma influenciar e persuadir os outros de forma espontânea.
    Gosta de trabalhar em equipe e de compartilhar. É aberta, entretém e motiva os outros.
    Entusiasmada, não tem medo de confiar. É otimista, faltante, impulsiva e emocional.
    Relacionado a: Situações sociais e de comunicação.`
  },
  S: {
    title:
      'Ênfase na cooperação, sinceridade e lealdade. Jogador de equipe, cooperativo e apóia os outros. Prefere ficar em segundo plano.',
    description: `O estável é um jogador de equipe, cooperativo e apoia os outros.
    Prefere ficar em segundo plano, trabalhando em um ambiente estável.
    Geralmente bons ouvintes e preferem evitar conflitos e mudanças.
    Ênfase na cooperação, sinceridade e lealdade.`
  },
  C: {
    title:
      'Tem ênfase na qualidade, precisão, organização e competência. É cooperativo, sincero e leal. Cauteloso e preocupado.',
    description: `Tem ênfase na qualidade, precisão, organização e competência. É cooperativo, sincero e leal.
    Cauteloso e preocupado. Focado no que é “correto”.
    Planeja à frente e se preocupa com a precisão. Precavido, preciso, reativo.`
  }
};

const useStyles = makeStyles({
  fieldset: {
    padding: '20px',
    borderRadius: '5px'
  },
  label: {
    margin: '10px',
    fontSize: 18,
    fontWeight: 500
  },
  footer: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center'
  }
});

const SectionStyleLeft = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const SectionStyleRight = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  height: 'auto',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
  padding: '30px',
  textAlign: ''
}));

export default function DiscTest() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState('');
  const [answer, setAnswer] = useState('');
  const [sumAnswers, setSumAnswers] = useState({
    D: 0,
    I: 0,
    S: 0,
    C: 0
  });

  // Formik validation
  const TestSchema = Yup.object().shape({
    employee: Yup.number().required('Campo obrigatório.')
  });

  const formik = useFormik({
    initialValues: {
      employee: ''
    },
    validationSchema: TestSchema
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (profile !== '' && values.employee && values.employee > 0) {
      updateEmployeeProfile();
    }
  }, [profile]);

  async function loadEmployees() {
    try {
      const employees = await getEmployees();
      setEmployees(employees);
    } catch (error) {
      NotificationManager.error(error.response.data, 'Erro', 6000);
    }
  }

  const handleNext = () => {
    const sum = sumAnswers[answer] + 1;
    setSumAnswers({
      ...sumAnswers,
      [answer]: sum
    });
    setAnswer('');

    if (currentQuestion === 29) {
      handleResultTest();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleResultTest = () => {
    const result = Object.keys(sumAnswers).reduce((a, b) =>
      sumAnswers[a] > sumAnswers[b] ? a : b
    );
    setProfile(result);
    setShowResult(!showResult);
  };

  async function updateEmployeeProfile() {
    try {
      await api.put(
        `api/employees/${values.employee}`,
        JSON.stringify({
          disc_profile: profile
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      NotificationManager.success('Perfil DISC salvo com sucesso.', 'Sucesso!', 6000);
    } catch (error) {
      NotificationManager.error(error.response.data, 'Erro', 6000);
    }
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Análise de perfil DISC
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Card style={{ padding: 20 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h5" gutterBottom>
                Realizar Teste de Perfil
              </Typography>
            </Stack>
            {showResult ? (
              <>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <MHidden width="mdDown">
                    <SectionStyleLeft>
                      <Typography variant="h4" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Seu perfil é {profile === 'D' && 'DOMINÂNCIA'}
                        {profile === 'I' && 'INFLUÊNCIA'}
                        {profile === 'S' && 'ESTABILIDADE'}
                        {profile === 'C' && 'CONFORMIDADE'}
                      </Typography>
                      <img src="/static/illustrations/illustration_dashboard.png" alt="login" />
                    </SectionStyleLeft>
                  </MHidden>
                  <MHidden width="mdDown">
                    <SectionStyleRight>
                      <Typography variant="h5" mt={3} sx={{ fontStyle: 'italic' }}>
                        {discDescriptions[profile].title}
                      </Typography>
                      <Typography variant="body1" mt={3} mb={3}>
                        {discDescriptions[profile].description}
                      </Typography>
                    </SectionStyleRight>
                  </MHidden>
                </Stack>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                >
                  <LoadingButton
                    onClick={() => navigate('/dashboard/disc')}
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Recomeçar Teste
                  </LoadingButton>
                </Stack>
              </>
            ) : (
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="select-employee-label">Quem irá fazer o teste?</InputLabel>
                    <Select
                      labelId="select-employee-label"
                      id="select-employee"
                      value={values.employee}
                      label="Funcionário"
                      {...getFieldProps('employee')}
                      error={Boolean(touched.employee && errors.employee)}
                      disabled={currentQuestion > 0}
                    >
                      <MenuItem value="0">Candidato ainda não cadastrado</MenuItem>
                      {employees && employees.length > 0
                        ? employees.map((employee) => (
                            <MenuItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </MenuItem>
                          ))
                        : []}
                    </Select>
                    <FormHelperText error={Boolean(touched.employee && errors.employee)}>
                      {touched.employee && errors.employee}
                    </FormHelperText>
                  </FormControl>
                </Stack>
                <fieldset className={classes.fieldset}>
                  <legend>
                    <FormLabel className={classes.label}>
                      Escolha a palavra que melhor lhe define:{' '}
                    </FormLabel>
                  </legend>
                  <FormControl>
                    <RadioGroup
                      aria-label="disc"
                      name="radio-buttons-group"
                      onChange={(e) => setAnswer(e.target.value)}
                      value={answer}
                    >
                      <FormControlLabel
                        value="D"
                        control={<Radio />}
                        label={disc[currentQuestion].D}
                      />
                      <FormControlLabel
                        value="I"
                        control={<Radio />}
                        label={disc[currentQuestion].I}
                      />
                      <FormControlLabel
                        value="S"
                        control={<Radio />}
                        label={disc[currentQuestion].S}
                      />
                      <FormControlLabel
                        value="C"
                        control={<Radio />}
                        label={disc[currentQuestion].C}
                      />
                    </RadioGroup>
                  </FormControl>
                </fieldset>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <LoadingButton
                    onClick={handleNext}
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={!answer || !values.employee}
                  >
                    {currentQuestion < 29 ? 'Próximo' : 'Concluir'}
                  </LoadingButton>
                </Stack>
                <Typography variant="label" align="right">
                  {disc.length - currentQuestion} questões restantes
                </Typography>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
