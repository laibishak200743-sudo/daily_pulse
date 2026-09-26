import React, {
  useMemo,
  useState,
} from 'react';

import {
  Flame,
  Globe2,
  Trophy,
} from 'lucide-react';

import {
  LeaderboardUser,
  Language,
  UserStats,
} from '../types';

import { sounds } from '../utils/audio';
import { translations } from '../data/translations';
import { getFlagEmoji } from '../data/countries';

interface LeaderboardScreenProps {
  users: LeaderboardUser[];
  loading?: boolean;
  stats: UserStats;
  language: Language;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
  currentUserCountryCode?: string;
  currentUserCountryName?: string;
  currentUserCountryFlag?: string;
  currentUserCountry?: string;
}

export const LeaderboardScreen: React.FC<
  LeaderboardScreenProps
> = ({
  users,
  loading = false,
  stats,
  language,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserCountryCode = 'DZ',
  currentUserCountryName = 'Algeria',
  currentUserCountryFlag = '🇩🇿',
  currentUserCountry,
}) => {
  const t =
    translations[language] ||
    translations.en;

  const isRtl =
    language === 'ar' ||
    language === 'ur';

  const [scope, setScope] =
    useState<
      'global' | 'country'
    >('global');

  const [timeframe, setTimeframe] =
    useState<
      'daily' | 'weekly' | 'all'
    >('daily');

  const resolvedCountryCode =
    currentUserCountryCode ||
    currentUserCountry ||
    'DZ';

  const resolvedCountryFlag =
    currentUserCountryFlag ||
    getFlagEmoji(
      resolvedCountryCode
    );

  const resolvedCountryName =
    currentUserCountryName ||
    currentUserCountry ||
    'Algeria';

  const getUserScore = (
    user: LeaderboardUser,
    selectedTimeframe:
      | 'daily'
      | 'weekly'
      | 'all'
  ): number => {
    if (
      selectedTimeframe ===
      'daily'
    ) {
      return (
        user.dailyBest ??
        user.dailyBestScore ??
        0
      );
    }

    if (
      selectedTimeframe ===
      'weekly'
    ) {
      return (
        user.weeklyBest ??
        user.weeklyScore ??
        0
      );
    }

    return (
      user.allTimeBest ??
      user.score ??
      0
    );
  };

  const myCurrentScore =
    useMemo(() => {
      if (
        timeframe === 'daily'
      ) {
        return stats.dailyBest;
      }

      if (
        timeframe === 'weekly'
      ) {
        return stats.totalScore;
      }

      return stats.personalBest;
    }, [
      timeframe,
      stats.dailyBest,
      stats.totalScore,
      stats.personalBest,
    ]);

  const sortedGlobalList =
    useMemo(() => {
      return [...users].sort(
        (a, b) =>
          getUserScore(
            b,
            timeframe
          ) -
          getUserScore(
            a,
            timeframe
          )
      );
    }, [
      users,
      timeframe,
    ]);

  const sortedCountryList =
    useMemo(() => {
      return users
        .filter((user) => {
          const userCode = (
            user.countryCode ||
            user.country ||
            ''
          ).toUpperCase();

          return (
            userCode ===
            resolvedCountryCode.toUpperCase()
          );
        })
        .sort(
          (a, b) =>
            getUserScore(
              b,
              timeframe
            ) -
            getUserScore(
              a,
              timeframe
            )
        );
    }, [
      users,
      resolvedCountryCode,
      timeframe,
    ]);

  const userGlobalRank =
    useMemo(() => {
      const index =
        sortedGlobalList.findIndex(
          (user) =>
            user.userId ===
              currentUserId ||
            user.id ===
              currentUserId
        );

      return index !== -1
        ? index + 1
        : null;
    }, [
      sortedGlobalList,
      currentUserId,
    ]);

  const userCountryRank =
    useMemo(() => {
      const index =
        sortedCountryList.findIndex(
          (user) =>
            user.userId ===
              currentUserId ||
            user.id ===
              currentUserId
        );

      return index !== -1
        ? index + 1
        : null;
    }, [
      sortedCountryList,
      currentUserId,
    ]);

  const activeList =
    scope === 'global'
      ? sortedGlobalList
      : sortedCountryList;

  const top3 =
    activeList.slice(0, 3);

  const remaining =
    activeList.slice(3);

  return (
    <div
      className="space-y-6"
      dir={
        isRtl
          ? 'rtl'
          : 'ltr'
      }
    >
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />

            <span>
              {t.leaderboard}
            </span>

            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold uppercase font-mono">
              {scope ===
              'global'
                ? 'GLOBAL'
                : resolvedCountryCode}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {t.heroTagline}
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 px-3.5 rounded-2xl shadow-sm self-start sm:self-auto text-xs">
          <div className="text-start">
            <span className="text-[10px] text-slate-400 block font-semibold leading-none">
              {t.yourRank ||
                'Your Rank'}
            </span>

            <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
              {userGlobalRank
                ? `#${userGlobalRank}`
                : '—'}
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="text-start">
            <span className="text-[10px] text-slate-400 block font-semibold leading-none">
              {t.countryRank ||
                'Country Rank'}
            </span>

            <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {userCountryRank
                ? `#${userCountryRank}`
                : '—'}{' '}
              ({resolvedCountryFlag})
            </span>
          </div>
        </div>
      </div>

      {/* Live status */}

      <div className="p-3.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />

        <span>
          {loading
            ? 'Loading live leaderboard...'
            : `${users.length} registered player${users.length === 1 ? '' : 's'} in the leaderboard`}
        </span>
      </div>

      {/* Filters */}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setScope('global');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              scope === 'global'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />

            <span>
              {t.scopeGlobal ||
                'Global'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setScope('country');
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              scope === 'country'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="text-sm">
              {resolvedCountryFlag}
            </span>

            <span>
              {t.scopeCountry ||
                'Country'}{' '}
              ({resolvedCountryCode})
            </span>
          </button>
        </div>

        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setTimeframe('daily');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              timeframe === 'daily'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.timeframeToday ||
              'Daily'}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setTimeframe('weekly');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              timeframe === 'weekly'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.timeframeWeek ||
              'Weekly'}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setTimeframe('all');
            }}
            className={`flex-1 sm:flex-initial px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              timeframe === 'all'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.timeframeAll ||
              'All Time'}
          </button>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="py-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />

            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Loading leaderboard...
            </span>
          </div>
        </div>
      )}

      {/* Empty */}

      {!loading &&
        activeList.length === 0 && (
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <Trophy className="w-10 h-10 mx-auto text-amber-500 mb-3" />

            <h3 className="font-black text-slate-900 dark:text-white">
              {t.leaderboard}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              No players yet.
            </p>
          </div>
        )}

      {/* Podium */}

      {!loading &&
        activeList.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 items-end max-w-2xl mx-auto">
            {top3[1] && (
              <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center relative shadow-sm">
                <span className="text-2xl sm:text-3xl mb-1">
                  {top3[1].avatar}
                </span>

                <span className="w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-black flex items-center justify-center mb-1">
                  #2
                </span>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full flex items-center justify-center gap-1">
                  <span>
                    {top3[1]
                      .countryFlag ||
                      getFlagEmoji(
                        top3[1]
                          .countryCode
                      )}
                  </span>

                  <span className="truncate">
                    {top3[1]
                      .username ||
                      top3[1].name}
                  </span>
                </h4>

                <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  {getUserScore(
                    top3[1],
                    timeframe
                  ).toLocaleString()}
                </span>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span>
                    Lvl {top3[1].level}
                  </span>

                  <span>·</span>

                  <span className="text-orange-500 font-mono">
                    {top3[1].streak}d
                  </span>
                </span>
              </div>
            )}

            {top3[0] && (
              <div className="flex flex-col items-center p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-white dark:via-slate-900 to-amber-50/50 dark:to-slate-950 border border-amber-500/40 text-center relative -mt-4 shadow-xl shadow-amber-500/10">
                <div className="text-3xl sm:text-4xl mb-1 relative">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-amber-500 text-base">
                    👑
                  </span>

                  {top3[0].avatar}
                </div>

                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center mb-1 shadow-md shadow-amber-500/30">
                  #1
                </span>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full flex items-center justify-center gap-1">
                  <span>
                    {top3[0]
                      .countryFlag ||
                      getFlagEmoji(
                        top3[0]
                          .countryCode
                      )}
                  </span>

                  <span className="truncate">
                    {top3[0]
                      .username ||
                      top3[0].name}
                  </span>
                </h4>

                <span className="text-sm sm:text-base font-mono font-black text-amber-600 dark:text-amber-400 mt-0.5">
                  {getUserScore(
                    top3[0],
                    timeframe
                  ).toLocaleString()}
                </span>

                <span className="text-[10px] text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-1 font-semibold">
                  <span>
                    Lvl {top3[0].level}
                  </span>

                  <span>·</span>

                  <span className="text-orange-500 font-mono">
                    {top3[0].streak}d 🔥
                  </span>
                </span>
              </div>
            )}

            {top3[2] && (
              <div className="flex flex-col items-center p-3.5 sm:p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center relative shadow-sm">
                <span className="text-2xl sm:text-3xl mb-1">
                  {top3[2].avatar}
                </span>

                <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black flex items-center justify-center mb-1">
                  #3
                </span>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate w-full flex items-center justify-center gap-1">
                  <span>
                    {top3[2]
                      .countryFlag ||
                      getFlagEmoji(
                        top3[2]
                          .countryCode
                      )}
                  </span>

                  <span className="truncate">
                    {top3[2]
                      .username ||
                      top3[2].name}
                  </span>
                </h4>

                <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  {getUserScore(
                    top3[2],
                    timeframe
                  ).toLocaleString()}
                </span>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span>
                    Lvl {top3[2].level}
                  </span>

                  <span>·</span>

                  <span className="text-orange-500 font-mono">
                    {top3[2].streak}d
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

      {/* Remaining players */}

      <div className="space-y-2">
        {!loading &&
          remaining.map(
            (player, index) => {
              const rank =
                index + 4;

              const isMe =
                player.userId ===
                  currentUserId ||
                player.id ===
                  currentUserId;

              return (
                <div
                  key={
                    player.userId ||
                    player.id ||
                    index
                  }
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors shadow-sm ${
                    isMe
                      ? 'bg-amber-500/10 border-amber-400 dark:border-amber-500/50 ring-1 ring-amber-400/40'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-mono font-bold text-xs text-slate-400 w-7 text-center shrink-0">
                      #{rank}
                    </span>

                    <span className="text-xl shrink-0">
                      {player.avatar}
                    </span>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-base leading-none">
                          {player.countryFlag ||
                            getFlagEmoji(
                              player.countryCode
                            )}
                        </span>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {player.username ||
                            player.name}
                        </h4>

                        {isMe && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                            You
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>
                          Lvl {player.level}
                        </span>

                        <span>
                          ·
                        </span>

                        <span className="flex items-center text-orange-500 gap-0.5 font-mono">
                          <Flame className="w-3 h-3 fill-current" />

                          {player.streak}d
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-end font-mono shrink-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">
                      {getUserScore(
                        player,
                        timeframe
                      ).toLocaleString()}
                    </span>

                    <span className="text-[9px] text-slate-400 block">
                      {t.score}
                    </span>
                  </div>
                </div>
              );
            }
          )}
      </div>

      {/* Current user */}

      <div className="sticky bottom-20 md:bottom-6 z-20 pt-2">
        <div className="flex items-center justify-between p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
              #
              {scope ===
              'global'
                ? userGlobalRank ??
                  '—'
                : userCountryRank ??
                  '—'}
            </span>

            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-amber-500/40 flex items-center justify-center text-xl shrink-0">
              {currentUserAvatar ||
                '⚡'}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">
                  {resolvedCountryFlag}
                </span>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {currentUserName}
                </h4>

                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-full border border-emerald-500/30">
                  LIVE
                </span>
              </div>

              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                {t.yourRank ||
                  'Global'}
                : #
                {userGlobalRank ??
                  '—'}{' '}
                ·{' '}
                {t.countryRank ||
                  'Country'}
                : #
                {userCountryRank ??
                  '—'}{' '}
                (
                {resolvedCountryCode})
              </p>
            </div>
          </div>

          <div className="text-end font-mono">
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
              {myCurrentScore.toLocaleString()}
            </span>

            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">
              {t.score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};