"use client";
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';

interface Jogador {
  id: number;
  nome: string;
  nota: number;
  isAvulso?: boolean;
  isEditandoNome?: boolean;
  isEditandoNota?: boolean;
}

interface Time {
  id: string; 
  nome: string;
  cor: string;
  jogadores: Jogador[];
  media: number;
}

interface JogadorGlobal extends Jogador {
  status: 'sem_time' | 'em_time_verde' | 'em_time_vermelho' | 'em_time_cinza' | 'em_time_amarelo' | 'ausente';
  originalmenteSelecionado: boolean;
  timeId?: string; 
}

const jogadoresBaseIniciais: Jogador[] = [
  { id: 1, nome: 'Dente', nota: 2 },
  { id: 2, nome: 'Matsuura', nota: 4 },
  { id: 3, nome: 'Russo', nota: 3 },
  { id: 4, nome: 'Jordan', nota: 2 },
  { id: 5, nome: 'Thiago', nota: 5 },
  { id: 6, nome: 'Jubao', nota: 3 },
  { id: 7, nome: 'Igor', nota: 4 },
  { id: 8, nome: 'Gracco', nota: 1 },
  { id: 9, nome: 'Beligol', nota: 1 },
  { id: 10, nome: 'Ale', nota: 3 },
  { id: 11, nome: 'Jonas', nota: 3 },
  { id: 12, nome: 'Leo', nota: 4 },
  { id: 13, nome: 'Fuinha', nota: 4 },
  { id: 14, nome: 'Abel', nota: 4 },
  { id: 15, nome: 'Vitor', nota: 5 },
  { id: 16, nome: 'Adriano', nota: 3 },
  { id: 17, nome: 'Poneis', nota: 3 },
  { id: 18, nome: 'Samir', nota: 5 },
  { id: 19, nome: 'Boy', nota: 5 },
  { id: 20, nome: 'Magaiver', nota: 4 },
  { id: 21, nome: 'Caio', nota: 3 },
  { id: 22, nome: 'Gu Borges', nota: 2 },
  { id: 23, nome: 'Zé', nota: 4 },
  { id: 24, nome: 'Rapha', nota: 1 },
];

const jogadoresAvulsosIniciais: Jogador[] = Array.from({ length: 6 }, (_, i) => ({
  id: 25 + i,
  nome: `Avulso ${i + 1}`,
  nota: 3, 
  isAvulso: true,
}));

const todosJogadoresIniciais: Jogador[] = [...jogadoresBaseIniciais, ...jogadoresAvulsosIniciais].sort((a, b) => {
  if (a.isAvulso && !b.isAvulso) return 1;
  if (!a.isAvulso && b.isAvulso) return -1;
  return b.nota - a.nota || a.nome.localeCompare(b.nome);
});

const CORES_TIMES_CONFIG = [
  { id: "time_verde", nome: "Verde", corHex: "bg-green-600", corTexto: "text-green-100", statusJogador: 'em_time_verde' as JogadorGlobal['status'] },
  { id: "time_vermelho", nome: "Vermelho", corHex: "bg-red-600", corTexto: "text-red-100", statusJogador: 'em_time_vermelho' as JogadorGlobal['status'] },
  { id: "time_cinza", nome: "Cinza", corHex: "bg-gray-600", corTexto: "text-gray-100", statusJogador: 'em_time_cinza' as JogadorGlobal['status'] },
  { id: "time_amarelo", nome: "Amarelo", corHex: "bg-yellow-500", corTexto: "text-yellow-900", statusJogador: 'em_time_amarelo' as JogadorGlobal['status'] },
];

const ADMIN_CODE = "raphaeljogador";
const COOLDOWN_SECONDS = 30 * 60;
const MIN_JOGADORES_SORTEIO = 10;
const MAX_JOGADORES_SORTEIO = 20; 

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function calcularMediaTime(time: Jogador[]): number {
  if (!time || time.length === 0) return 0;
  const somaNotas = time.reduce((acc, jogador) => acc + jogador.nota, 0);
  return parseFloat((somaNotas / time.length).toFixed(2));
}

function isTimeValid(time: Jogador[]): boolean {
  const countNota1 = time.filter(j => j.nota === 1).length;
  const countNota5 = time.filter(j => j.nota === 5).length;
  return countNota1 <= 1 && countNota5 <= 1;
}

function sortearTimesEquilibrados(jogadoresSelecionadosParaSorteio: Jogador[]): Time[] {
  const n_jogadores = jogadoresSelecionadosParaSorteio.length;
  if (n_jogadores < MIN_JOGADORES_SORTEIO || n_jogadores > MAX_JOGADORES_SORTEIO) return [];

  const max_times_permitido = 4;
  const jogadores_por_time_ideal = 5;
  const tamanhos_dos_times_calculado: number[] = [];

  if (n_jogadores > 0) {
    const times_completos_de_5 = Math.floor(n_jogadores / jogadores_por_time_ideal);
    const jogadores_no_ultimo_time = n_jogadores % jogadores_por_time_ideal;

    if (times_completos_de_5 >= max_times_permitido) {
        const base = Math.floor(n_jogadores / max_times_permitido);
        const extra = n_jogadores % max_times_permitido;
        for (let i = 0; i < max_times_permitido; i++) {
            tamanhos_dos_times_calculado.push(base + (i < extra ? 1 : 0));
        }
    } else {
        for (let i = 0; i < times_completos_de_5; i++) {
            tamanhos_dos_times_calculado.push(jogadores_por_time_ideal);
        }
        if (jogadores_no_ultimo_time > 0) {
            tamanhos_dos_times_calculado.push(jogadores_no_ultimo_time);
        }
    }
    if (tamanhos_dos_times_calculado.length === 0 && n_jogadores > 0) { 
        tamanhos_dos_times_calculado.push(n_jogadores);
    }
  }
  
  const numeroDeTimesFinal = tamanhos_dos_times_calculado.length;
  if (numeroDeTimesFinal === 0) return [];

  let melhorCombinacaoDeTimes: Jogador[][] = [];
  let menorDiferencaMedias = Infinity;
  let tentativas = 0;

  while (tentativas < 800) { 
    const jogadoresParaDistribuir = shuffleArray([...jogadoresSelecionadosParaSorteio]);
    const timesAtuais: Jogador[][] = Array.from({ length: numeroDeTimesFinal }, () => []);
    let currentPlayerIndex = 0;
    for (let i = 0; i < numeroDeTimesFinal; i++) {
        for (let j = 0; j < tamanhos_dos_times_calculado[i]; j++) {
            if (currentPlayerIndex < jogadoresParaDistribuir.length) {
                timesAtuais[i].push(jogadoresParaDistribuir[currentPlayerIndex++]);
            }
        }
    }
    const distribuicaoCorreta = timesAtuais.every((time, idx) => time.length === tamanhos_dos_times_calculado[idx]);
    if (!distribuicaoCorreta) {
        tentativas++;
        continue;
    }
    
    for (let iter = 0; iter < 50; iter++) { 
      const mediasTimes = timesAtuais.map(t => calcularMediaTime(t));
      let idxMaiorMedia = -1, idxMenorMedia = -1;
      let maiorMedia = -Infinity, menorMedia = Infinity;

      mediasTimes.forEach((media, idx) => {
        if (timesAtuais[idx].length > 0) {
            if (media > maiorMedia) { maiorMedia = media; idxMaiorMedia = idx; }
            if (media < menorMedia) { menorMedia = media; idxMenorMedia = idx; }
        }
      });

      if (idxMaiorMedia === -1 || idxMenorMedia === -1 || idxMaiorMedia === idxMenorMedia || timesAtuais[idxMaiorMedia].length === 0 || timesAtuais[idxMenorMedia].length === 0) break;

      let trocou = false;
      for (let i = 0; i < timesAtuais[idxMaiorMedia].length; i++) {
        for (let j = 0; j < timesAtuais[idxMenorMedia].length; j++) {
          const jogadorDoTimeRico = timesAtuais[idxMaiorMedia][i];
          const jogadorDoTimePobre = timesAtuais[idxMenorMedia][j];

          const novoTimeRico = [...timesAtuais[idxMaiorMedia]]; novoTimeRico[i] = jogadorDoTimePobre;
          const novoTimePobre = [...timesAtuais[idxMenorMedia]]; novoTimePobre[j] = jogadorDoTimeRico;

          if (isTimeValid(novoTimeRico) && isTimeValid(novoTimePobre)) {
            const novaMediaRico = calcularMediaTime(novoTimeRico);
            const novaMediaPobre = calcularMediaTime(novoTimePobre);
            
            const mediasAposTroca = [...mediasTimes];
            mediasAposTroca[idxMaiorMedia] = novaMediaRico;
            mediasAposTroca[idxMenorMedia] = novaMediaPobre;
            const maxMediaNova = Math.max(...mediasAposTroca.filter((m,ix)=>timesAtuais[ix].length > 0));
            const minMediaNova = Math.min(...mediasAposTroca.filter((m,ix)=>timesAtuais[ix].length > 0));
            const diffGlobalNova = maxMediaNova - minMediaNova;
            const diffGlobalOriginal = maiorMedia - menorMedia;

            if (diffGlobalNova < diffGlobalOriginal - 0.001) { 
              timesAtuais[idxMaiorMedia] = novoTimeRico;
              timesAtuais[idxMenorMedia] = novoTimePobre;
              trocou = true; break;
            }
          }
        }
        if (trocou) break;
      }
      if (!trocou) break; 
    }

    const todosOsTimesFormadosSaoValidos = timesAtuais.every(isTimeValid);
    if (!todosOsTimesFormadosSaoValidos) {
        tentativas++;
        continue; 
    }

    const mediasFinais = timesAtuais.map(t => calcularMediaTime(t)).filter((m,ix)=>timesAtuais[ix].length > 0);
    if (mediasFinais.length === 0 && n_jogadores > 0) { tentativas++; continue; }
    if (mediasFinais.length <= 1 && n_jogadores > 0) { 
        menorDiferencaMedias = 0;
        melhorCombinacaoDeTimes = timesAtuais.map(time => [...time]);
        break;
    }
    const maxMediaFinal = Math.max(...mediasFinais);
    const minMediaFinal = Math.min(...mediasFinais);
    const diffAtual = maxMediaFinal - minMediaFinal;

    if (diffAtual < menorDiferencaMedias) {
      menorDiferencaMedias = diffAtual;
      melhorCombinacaoDeTimes = timesAtuais.map(time => [...time]);
    }
    if (menorDiferencaMedias < (n_jogadores > 15 ? 0.2 : 0.5) && n_jogadores > 0) break; 
    tentativas++;
  }

  if (melhorCombinacaoDeTimes.length === 0 && n_jogadores > 0) {
    const jogadoresFallback = shuffleArray([...jogadoresSelecionadosParaSorteio]);
    melhorCombinacaoDeTimes = Array.from({ length: numeroDeTimesFinal }, () => []);
    let currentFallbackPlayerIndex = 0;
    for (let i = 0; i < numeroDeTimesFinal; i++) {
        const teamSize = tamanhos_dos_times_calculado[i];
        for (let j = 0; j < teamSize; j++) {
            if (currentFallbackPlayerIndex < jogadoresFallback.length) {
                melhorCombinacaoDeTimes[i].push(jogadoresFallback[currentFallbackPlayerIndex++]);
            }
        }
    }
  }

  return melhorCombinacaoDeTimes.filter(t => t.length > 0).map((timeJogadores, index) => ({
    id: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].id,
    nome: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].nome,
    cor: CORES_TIMES_CONFIG[index % CORES_TIMES_CONFIG.length].corHex,
    jogadores: timeJogadores.sort((a,b) => b.nota - a.nota),
    media: calcularMediaTime(timeJogadores),
  }));
}

export default function HomePage() {
  const [listaCompletaJogadores, setListaCompletaJogadores] = useState<Jogador[]>(todosJogadoresIniciais);
  const [jogadoresSelecionadosIds, setJogadoresSelecionadosIds] = useState<Set<number>>(new Set());
  const [timesSorteados, setTimesSorteados] = useState<Time[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [cooldownRestante, setCooldownRestante] = useState(0);
  const [ultimoSorteioTimestamp, setUltimoSorteioTimestamp] = useState<number | null>(null);
  const [anoAtual, setAnoAtual] = useState<number>(new Date().getFullYear());
  
  const [timeEditando, setTimeEditando] = useState<Time | null>(null);
  const [jogadoresGlobaisParaEdicao, setJogadoresGlobaisParaEdicao] = useState<JogadorGlobal[]>([]);
  const [nomeEditando, setNomeEditando] = useState('');
  const [notaEditando, setNotaEditando] = useState<number | string>('');

  useEffect(() => {
    setAnoAtual(new Date().getFullYear());
    localStorage.removeItem("isAdminPeloChurrasco"); 
    setIsAdmin(false);

    const ultimoSorteio = localStorage.getItem("ultimoSorteioTimestampPeloChurrasco");
    if (ultimoSorteio) {
      const ts = parseInt(ultimoSorteio, 10);
      setUltimoSorteioTimestamp(ts);
      const agora = Date.now();
      const diffSegundos = Math.floor((agora - ts) / 1000);
      const restante = COOLDOWN_SECONDS - diffSegundos;
      if (restante > 0 && !isAdmin) setCooldownRestante(restante); 
      else setCooldownRestante(0);
    }
  }, []); 

  useEffect(() => {
    if (isAdmin || !ultimoSorteioTimestamp || cooldownRestante <= 0) {
      if (cooldownRestante > 0 && !isAdmin) {} else { setCooldownRestante(0); }
      return;
    }
    const interval = setInterval(() => {
      setCooldownRestante(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAdmin, ultimoSorteioTimestamp, cooldownRestante]);

  const atualizarJogadoresGlobaisParaEdicao = useCallback((currentTimes: Time[], selectedIds: Set<number>, currentListaJogadores: Jogador[]) => {
    const todosJogadores: JogadorGlobal[] = currentListaJogadores.map(j => {
      const originalmenteSelecionado = selectedIds.has(j.id);
      let status: JogadorGlobal['status'] = originalmenteSelecionado ? 'sem_time' : 'ausente';
      let timeId: string | undefined = undefined;

      for (const time of currentTimes) {
        if (time.jogadores.find(p => p.id === j.id)) {
          const configCor = CORES_TIMES_CONFIG.find(c => c.id === time.id);
          status = configCor ? configCor.statusJogador : 'sem_time'; 
          timeId = time.id;
          break;
        }
      }
      return { ...j, status, originalmenteSelecionado, timeId };
    });
    setJogadoresGlobaisParaEdicao(todosJogadores);
  }, []);

  const handleSelecaoJogador = (idJogador: number) => {
    setJogadoresSelecionadosIds(prevSelecionados => {
      const novosSelecionados = new Set(prevSelecionados);
      if (novosSelecionados.has(idJogador)) {
        novosSelecionados.delete(idJogador);
      } else {
        if (novosSelecionados.size < MAX_JOGADORES_SORTEIO) {
          novosSelecionados.add(idJogador);
        }
      }
      return novosSelecionados;
    });
  };

  const podeSortearAgora = 
    jogadoresSelecionadosIds.size >= MIN_JOGADORES_SORTEIO && 
    jogadoresSelecionadosIds.size <= MAX_JOGADORES_SORTEIO && 
    (isAdmin || cooldownRestante <= 0);

  const handleSortearTimes = () => {
    if (!podeSortearAgora) return;
    const jogadoresParaSorteio = listaCompletaJogadores.filter(j => jogadoresSelecionadosIds.has(j.id));
    const novosTimesSorteados = sortearTimesEquilibrados(jogadoresParaSorteio);
    setTimesSorteados(novosTimesSorteados);
    atualizarJogadoresGlobaisParaEdicao(novosTimesSorteados, jogadoresSelecionadosIds, listaCompletaJogadores);
    if (!isAdmin) {
      const agora = Date.now();
      setUltimoSorteioTimestamp(agora);
      localStorage.setItem("ultimoSorteioTimestampPeloChurrasco", agora.toString());
      setCooldownRestante(COOLDOWN_SECONDS);
    }
  };

  const handleAdminCodeSubmit = () => {
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdmin(true); 
      localStorage.setItem("isAdminPeloChurrasco", "true");
      setShowAdminInput(false); 
      setAdminCodeInput(""); 
      setCooldownRestante(0);
    } else {
      alert("Código de administrador incorreto!");
      localStorage.removeItem("isAdminPeloChurrasco");
      setIsAdmin(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleVoltarParaSelecao = () => {
    setTimesSorteados([]);
    setJogadoresGlobaisParaEdicao([]);
    setTimeEditando(null); 
  };

  const iniciarEdicaoTime = (timeParaEditar: Time) => {
    setTimeEditando({...timeParaEditar}); 
  };

  const adicionarJogadorAoTimeEditando = (jogadorParaAdicionar: JogadorGlobal) => {
    if (!timeEditando || timeEditando.jogadores.length >= 5) return;

    const novosTimesSorteados = [...timesSorteados]; 
    const timeAlvoIndex = novosTimesSorteados.findIndex(t => t.id === timeEditando.id);
    if (timeAlvoIndex === -1) return;

    if (jogadorParaAdicionar.status !== 'sem_time' && jogadorParaAdicionar.status !== 'ausente') {
      const timeOrigemId = jogadorParaAdicionar.timeId;
      if (timeOrigemId) {
        const timeOrigemIndex = novosTimesSorteados.findIndex(t => t.id === timeOrigemId);
        if (timeOrigemIndex !== -1) {
          novosTimesSorteados[timeOrigemIndex] = {
            ...novosTimesSorteados[timeOrigemIndex],
            jogadores: novosTimesSorteados[timeOrigemIndex].jogadores.filter(j => j.id !== jogadorParaAdicionar.id),
          };
          novosTimesSorteados[timeOrigemIndex].media = calcularMediaTime(novosTimesSorteados[timeOrigemIndex].jogadores);
        }
      }
    }

    const jogadorLimpo: Jogador = {id: jogadorParaAdicionar.id, nome: jogadorParaAdicionar.nome, nota: jogadorParaAdicionar.nota, isAvulso: jogadorParaAdicionar.isAvulso };
    novosTimesSorteados[timeAlvoIndex] = {
      ...novosTimesSorteados[timeAlvoIndex],
      jogadores: [...novosTimesSorteados[timeAlvoIndex].jogadores, jogadorLimpo].sort((a,b) => b.nota - a.nota),
    };
    novosTimesSorteados[timeAlvoIndex].media = calcularMediaTime(novosTimesSorteados[timeAlvoIndex].jogadores);
    
    setTimesSorteados(novosTimesSorteados);
    setTimeEditando(novosTimesSorteados[timeAlvoIndex]);
    atualizarJogadoresGlobaisParaEdicao(novosTimesSorteados, jogadoresSelecionadosIds, listaCompletaJogadores);
  };

  const removerJogadorDoTimeEditando = (jogadorParaRemover: Jogador) => {
    if (!timeEditando) return;
    const novosTimesSorteados = [...timesSorteados]; 
    const timeAlvoIndex = novosTimesSorteados.findIndex(t => t.id === timeEditando.id);
    if (timeAlvoIndex === -1) return;

    novosTimesSorteados[timeAlvoIndex] = {
      ...novosTimesSorteados[timeAlvoIndex],
      jogadores: novosTimesSorteados[timeAlvoIndex].jogadores.filter(j => j.id !== jogadorParaRemover.id),
    };
    novosTimesSorteados[timeAlvoIndex].media = calcularMediaTime(novosTimesSorteados[timeAlvoIndex].jogadores);

    setTimesSorteados(novosTimesSorteados);
    setTimeEditando(novosTimesSorteados[timeAlvoIndex]);
    atualizarJogadoresGlobaisParaEdicao(novosTimesSorteados, jogadoresSelecionadosIds, listaCompletaJogadores);
  };

  const salvarEdicaoTime = () => {
    setTimeEditando(null);
  };

  const getNomeTimePorId = (timeId: string | undefined): string => {
    if (!timeId) return "";
    const config = CORES_TIMES_CONFIG.find(c => c.id === timeId);
    return config ? `Time ${config.nome}` : "";
  }

  const toggleEditNome = (jogadorId: number) => {
    if (!isAdmin) return;
    setListaCompletaJogadores(prev => prev.map(j => 
      j.id === jogadorId ? {...j, isEditandoNome: !j.isEditandoNome, isEditandoNota: false } : {...j, isEditandoNome: false, isEditandoNota: false}
    ));
    const jogador = listaCompletaJogadores.find(j => j.id === jogadorId);
    if (jogador) setNomeEditando(jogador.nome);
  };

  const toggleEditNota = (jogadorId: number) => {
    if (!isAdmin) return;
    setListaCompletaJogadores(prev => prev.map(j => 
      j.id === jogadorId ? {...j, isEditandoNota: !j.isEditandoNota, isEditandoNome: false } : {...j, isEditandoNome: false, isEditandoNota: false}
    ));
    const jogador = listaCompletaJogadores.find(j => j.id === jogadorId);
    if (jogador) setNotaEditando(jogador.nota);
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeEditando(e.target.value);
  };

  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (/^[1-5]$/.test(val) && parseInt(val) >=1 && parseInt(val) <=5)) {
        setNotaEditando(val === '' ? '' : parseInt(val));
    }
  };

  const salvarAlteracaoJogador = (jogadorId: number) => {
    if (!isAdmin) return;
    let jogadorAtualizadoGlobal: Jogador | undefined;
    setListaCompletaJogadores(prev => prev.map(j => {
      if (j.id === jogadorId) {
        const novoNome = j.isEditandoNome && nomeEditando.trim() !== '' ? nomeEditando.trim() : j.nome;
        const novaNota = j.isEditandoNota && notaEditando !== '' && !isNaN(Number(notaEditando)) ? Number(notaEditando) : j.nota;
        jogadorAtualizadoGlobal = {...j, nome: novoNome, nota: novaNota, isEditandoNome: false, isEditandoNota: false };
        return jogadorAtualizadoGlobal;
      }
      return {...j, isEditandoNome: false, isEditandoNota: false };
    }));
    
    if (timesSorteados.length > 0 && jogadorAtualizadoGlobal) {
        const jogadorFinal = jogadorAtualizadoGlobal;
        const novosTimes = timesSorteados.map(time => {
            const jogadorNoTimeIndex = time.jogadores.findIndex(j => j.id === jogadorId);
            if (jogadorNoTimeIndex !== -1) {
                const novosJogadoresTime = [...time.jogadores];
                novosJogadoresTime[jogadorNoTimeIndex] = {...jogadorFinal};
                return {...time, jogadores: novosJogadoresTime.sort((a,b) => b.nota - a.nota), media: calcularMediaTime(novosJogadoresTime)};
            }
            return time;
        });
        setTimesSorteados(novosTimes);
        const listaAposSalvar = listaCompletaJogadores.map(j => j.id === jogadorId && jogadorFinal ? jogadorFinal : j);
        atualizarJogadoresGlobaisParaEdicao(novosTimes, jogadoresSelecionadosIds, listaAposSalvar);
    }
  };

  const jogadoresNormais = listaCompletaJogadores.filter(j => !j.isAvulso);
  const jogadoresAvulsosLista = listaCompletaJogadores.filter(j => j.isAvulso);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-900 to-gray-900 text-white flex flex-col">
      {/* Cabeçalho Modernizado */}
      <header className="p-4 shadow-lg bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 sticky top-0 z-50">
        <div className="container mx-auto relative flex flex-col items-center">
          {/* Logo e Título Centralizados */}
          <div className="flex flex-col items-center justify-center text-center mb-3">
            <div className="p-1 rounded-full border-4 border-green-400 shadow-xl mb-2 transform transition-all duration-300 hover:scale-105">
              <Image src="/logo.png" alt="Pelo Churrasco F.C. Logo" width={64} height={64} className="rounded-full" /> 
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-400">Pelo Churrasco F.C.</h1>
          </div>

          {/* Botão de Acesso Admin - Posicionado no canto superior direito */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <button 
              onClick={() => setShowAdminInput(!showAdminInput)} 
              className="text-xs sm:text-sm text-indigo-200 hover:text-white px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            >
              {isAdmin ? "Admin Ativado" : "Acesso Restrito"}
            </button>
          </div>
        
          {/* Input do Código Admin - Aparece abaixo do cabeçalho centralizado quando ativo */}
          {showAdminInput && !isAdmin && (
            <div className="w-full max-w-xs sm:max-w-sm mt-2 p-3 bg-gray-800 bg-opacity-95 rounded-xl shadow-2xl flex items-center gap-2">
              <input 
                type="password" 
                placeholder="Código de Administrador"
                value={adminCodeInput}
                onChange={(e) => setAdminCodeInput(e.target.value)}
                className="p-2 rounded-md bg-gray-700 text-white w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm shadow-inner"
              />
              <button 
                onClick={handleAdminCodeSubmit} 
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md font-semibold text-sm transition-colors duration-150 shadow-md transform hover:scale-105"
              >
                Desbloquear
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        {timesSorteados.length === 0 ? (
          <>
            <section id="selecao-jogadores-normais" className="mb-6 p-5 bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl backdrop-blur-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-1 text-green-400">Selecione de {MIN_JOGADORES_SORTEIO} a {MAX_JOGADORES_SORTEIO} Jogadores</h2>
              <p className="mb-3 text-sm text-gray-300">Jogadores selecionados: {jogadoresSelecionadosIds.size} (Min: {MIN_JOGADORES_SORTEIO}, Max: {MAX_JOGADORES_SORTEIO})</p>
              <h3 className="text-lg font-medium mb-2 text-green-300">Jogadores Base ({jogadoresNormais.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                {jogadoresNormais.map((jogador) => (
                  <div key={jogador.id} 
                       onClick={() => handleSelecaoJogador(jogador.id)}
                       className={`p-2.5 rounded-lg transition-all duration-200 ease-in-out text-xs md:text-sm flex items-center shadow-md hover:shadow-lg 
                                      ${jogadoresSelecionadosIds.has(jogador.id) ? 'bg-green-600 ring-2 ring-green-300 shadow-green-500/50' : 'bg-gray-700 hover:bg-gray-600'}
                                      ${!jogadoresSelecionadosIds.has(jogador.id) && jogadoresSelecionadosIds.size >= MAX_JOGADORES_SORTEIO ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-400 mr-2 cursor-pointer"
                      checked={jogadoresSelecionadosIds.has(jogador.id)}
                      onChange={(e) => { e.stopPropagation(); handleSelecaoJogador(jogador.id); }}
                      disabled={!jogadoresSelecionadosIds.has(jogador.id) && jogadoresSelecionadosIds.size >= MAX_JOGADORES_SORTEIO}
                    />
                    {isAdmin && jogador.isEditandoNome ? (
                      <input type="text" value={nomeEditando} onChange={handleNomeChange} onBlur={() => salvarAlteracaoJogador(jogador.id)} onClick={(e) => e.stopPropagation()} autoFocus className="bg-gray-600 text-white p-0.5 rounded w-full text-xs" />
                    ) : (
                      <span onClick={(e) => { if(isAdmin) {e.stopPropagation(); toggleEditNome(jogador.id);}}} className={`truncate ${isAdmin ? 'cursor-text' : ''}`} title={jogador.nome}>{jogador.nome}</span>
                    )}
                    {isAdmin && jogador.isEditandoNota ? (
                      <input type="number" value={notaEditando} onChange={handleNotaChange} onBlur={() => salvarAlteracaoJogador(jogador.id)} onClick={(e) => e.stopPropagation()} autoFocus className="bg-gray-600 text-white p-0.5 rounded w-10 ml-1 text-xs" min="1" max="5" />
                    ) : (
                      <span onClick={(e) => { if(isAdmin) {e.stopPropagation(); toggleEditNota(jogador.id);}}} className={`text-gray-400 ml-1 ${isAdmin ? 'cursor-text' : ''}`}>({jogador.nota})</span>
                    )}
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-medium mb-2 text-green-300">Jogadores Avulsos ({jogadoresAvulsosLista.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {jogadoresAvulsosLista.map((jogador) => (
                   <div key={jogador.id} 
                        onClick={() => handleSelecaoJogador(jogador.id)}
                        className={`p-2.5 rounded-lg transition-all duration-200 ease-in-out text-xs md:text-sm flex items-center shadow-md hover:shadow-lg 
                                      ${jogadoresSelecionadosIds.has(jogador.id) ? 'bg-green-600 ring-2 ring-green-300 shadow-green-500/50' : 'bg-gray-700 hover:bg-gray-600'}
                                      ${!jogadoresSelecionadosIds.has(jogador.id) && jogadoresSelecionadosIds.size >= MAX_JOGADORES_SORTEIO ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-500 bg-gray-800 border-gray-600 rounded focus:ring-green-400 mr-2 cursor-pointer"
                      checked={jogadoresSelecionadosIds.has(jogador.id)}
                      onChange={(e) => { e.stopPropagation(); handleSelecaoJogador(jogador.id); }}
                      disabled={!jogadoresSelecionadosIds.has(jogador.id) && jogadoresSelecionadosIds.size >= MAX_JOGADORES_SORTEIO}
                    />
                     {isAdmin && jogador.isEditandoNome ? (
                      <input type="text" value={nomeEditando} onChange={handleNomeChange} onBlur={() => salvarAlteracaoJogador(jogador.id)} onClick={(e) => e.stopPropagation()} autoFocus className="bg-gray-600 text-white p-0.5 rounded w-full text-xs" />
                    ) : (
                      <span onClick={(e) => { if(isAdmin) {e.stopPropagation(); toggleEditNome(jogador.id);}}} className={`truncate ${isAdmin ? 'cursor-text' : ''}`} title={jogador.nome}>{jogador.nome}</span>
                    )}
                    {isAdmin && jogador.isEditandoNota ? (
                      <input type="number" value={notaEditando} onChange={handleNotaChange} onBlur={() => salvarAlteracaoJogador(jogador.id)} onClick={(e) => e.stopPropagation()} autoFocus className="bg-gray-600 text-white p-0.5 rounded w-10 ml-1 text-xs" min="1" max="5" />
                    ) : (
                      <span onClick={(e) => { if(isAdmin) {e.stopPropagation(); toggleEditNota(jogador.id);}}} className={`text-gray-400 ml-1 ${isAdmin ? 'cursor-text' : ''}`}>({jogador.nota})</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section id="times-sorteados" className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-400">Times Sorteados!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {timesSorteados.map((time) => (
                <div key={time.id} className={`p-4 rounded-xl shadow-2xl flex flex-col ${time.cor} ${CORES_TIMES_CONFIG.find(c=>c.id === time.id)?.corTexto} transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50`}>
                  <h3 className="text-xl font-bold mb-2 text-center">Time {time.nome}</h3>
                  <p className="text-sm mb-3 text-center font-semibold">Média: {time.media.toFixed(2)}</p>
                  <ul className="space-y-1.5 text-sm flex-grow">
                    {time.jogadores.map(jogador => (
                      <li key={jogador.id} className="p-2 bg-black bg-opacity-25 rounded-md shadow-sm">
                        {jogador.nome} (Nota: {jogador.nota})
                      </li>
                    ))}
                  </ul>
                  {isAdmin && (
                    <button 
                      onClick={() => iniciarEdicaoTime(time)}
                      className="mt-4 w-full py-2 px-3 bg-black bg-opacity-30 hover:bg-opacity-40 rounded-md text-xs font-semibold transition-colors duration-150 transform hover:scale-105">
                      Editar Time
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isAdmin && timesSorteados.length > 0 && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleVoltarParaSelecao}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors duration-150 shadow-lg transform hover:scale-105">
                        Voltar para Seleção
                    </button>
                </div>
            )}
          </section>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleSortearTimes}
            className={`px-8 py-4 text-base md:text-lg font-bold rounded-xl transition-all duration-200 ease-in-out w-full md:w-auto transform hover:scale-105 
                        ${podeSortearAgora ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-2xl shadow-green-500/50' : 'bg-gray-700 cursor-not-allowed text-gray-400 opacity-60'}`}
            disabled={!podeSortearAgora}
          >
            {timesSorteados.length > 0 ? 'Sortear Novos Times' : 'Sortear Times'}
          </button>
          {!isAdmin && cooldownRestante > 0 && (
            <p className="mt-4 text-sm text-yellow-300">Novo sorteio em: {formatTime(cooldownRestante)}</p>
          )}
           {jogadoresSelecionadosIds.size > 0 && jogadoresSelecionadosIds.size < MIN_JOGADORES_SORTEIO && (
            <p className="mt-4 text-sm text-red-400">Selecione pelo menos {MIN_JOGADORES_SORTEIO} jogadores para sortear.</p>
          )}
        </div>
        
        {timeEditando && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setTimeEditando(null)}> 
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-700" onClick={(e) => e.stopPropagation()}> 
              <h3 className="text-xl font-bold mb-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-400">Editando Time {timeEditando.nome} (Máx: 5)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <h4 className="text-md font-semibold mb-2 text-gray-200">Jogadores no Time ({timeEditando.jogadores.length}/5):</h4>
                  {timeEditando.jogadores.length > 0 ? (
                      <ul className="space-y-2 min-h-[120px]">
                      {timeEditando.jogadores.map(j => (
                          <li key={`editando-${j.id}`} className="flex items-center justify-between p-2.5 bg-gray-700 rounded-lg text-sm shadow-md">
                          <span>{j.nome} (Nota: {j.nota})</span>
                          <button onClick={() => removerJogadorDoTimeEditando(j)} className="text-red-400 hover:text-red-300 text-xs font-semibold ml-2 transition-colors transform hover:scale-110">Remover</button>
                          </li>
                      ))}
                      </ul>
                  ) : <p className="text-sm text-gray-500 min-h-[120px] flex items-center justify-center">Nenhum jogador neste time.</p>}
                </div>

                <div>
                  <h4 className="text-md font-semibold mb-2 text-gray-200">Adicionar Jogador:</h4>
                  {jogadoresGlobaisParaEdicao.filter(j => !timeEditando.jogadores.find(tj => tj.id === j.id) && (j.originalmenteSelecionado || j.status === 'ausente' || j.isAvulso)).length > 0 ? (
                      <ul className="space-y-2 max-h-60 md:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {jogadoresGlobaisParaEdicao
                        .filter(j => !timeEditando.jogadores.find(tj => tj.id === j.id) && (j.originalmenteSelecionado || j.status === 'ausente' || j.isAvulso)) 
                        .sort((a,b) => b.nota - a.nota)
                        .map(j => (
                            <li key={`global-${j.id}`} className="flex items-center justify-between p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm shadow-md transition-colors">
                            <div>
                                <span>{j.nome} (Nota: {j.nota}) {j.isAvulso ? "(Avulso)" : ""}</span>
                                <span className="text-xs ml-2 text-gray-400">
                                    {j.status === 'ausente' ? '(Não Selecionado)' : 
                                     j.status === 'sem_time' ? '(Sem Time)' : 
                                     `(${getNomeTimePorId(j.timeId)})`}
                                </span>
                            </div>
                            <button 
                                onClick={() => adicionarJogadorAoTimeEditando(j)} 
                                className={`text-green-400 hover:text-green-300 text-xs font-semibold ml-2 transition-colors transform hover:scale-110 ${timeEditando.jogadores.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={timeEditando.jogadores.length >= 5}
                            >
                                Adicionar
                            </button>
                            </li>
                      ))}
                      </ul>
                  ) : <p className="text-sm text-gray-500 min-h-[120px] flex items-center justify-center">Nenhum jogador disponível ou time cheio.</p>}
                </div>
              </div>

              <p className="text-sm text-gray-300 my-4 text-center">Média atual do time: {timeEditando.media.toFixed(2)}</p>

              <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => setTimeEditando(null)} className="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm font-semibold transition-colors shadow-md transform hover:scale-105">Cancelar</button>
                <button onClick={salvarEdicaoTime} className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 rounded-lg text-sm font-semibold text-white shadow-lg transform hover:scale-105">Concluir Edição</button>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="p-5 text-center text-xs md:text-sm text-gray-400 bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 mt-auto border-t border-gray-700">
        <p>Desenvolvido por Raphael Pezzuol</p>
        <p>© {anoAtual} Pelo Churrasco F.C. - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

