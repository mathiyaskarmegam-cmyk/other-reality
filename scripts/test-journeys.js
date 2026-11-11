// ==============================================================================
// THE OTHER REALITY — AUTOMATED USER JOURNEY TEST SUITE
// Tests all 16 User Journeys and Security Policies from PRD Section 16
// ==============================================================================

// Polyfills for running under Node CLI environment
if (!globalThis.localStorage) {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { for (const k in store) delete store[k]; },
  };
}
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = () => 'blob:mock-image-url-preview';
  globalThis.URL.revokeObjectURL = () => {};
}
if (!globalThis.File) {
  globalThis.File = class File {
    constructor(chunks, name, opts) {
      this.name = name;
      this.type = opts?.type || '';
    }
  };
}

import { supabaseApi } from '../src/lib/supabase.ts';
import { DEMO_PROFILES, INITIAL_EXPERIENCES } from '../src/lib/seedData.ts';

// Simple lightweight test runner
let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
    passedTests++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('STARTING "THE OTHER REALITY" COMPREHENSIVE TEST SUITE');
  console.log('======================================================\n');

  // Journey 1 & 2: Register a new account with pseudonym and avatar
  console.log('--- Journey 1 & 2: Register account & public pseudonymous persona ---');
  const regEmail = `peaceful_wanderer_${Date.now()}@domain.org`;
  const regPassword = 'tranquilPassword123!';
  const regNickname = 'peaceful_wanderer';
  const regAvatar = 'fog';

  const regResult = await supabaseApi.signUp({
    email: regEmail,
    password: regPassword,
    nickname: regNickname,
    avatar: regAvatar,
    is_moderator: false,
  });

  assert(regResult.user && regResult.user.id, 'User account registered with valid ID');
  assert(regResult.profile.nickname === regNickname, 'Public nickname properly associated');
  assert(regResult.profile.avatar === regAvatar, 'Public avatar motif properly associated');
  assert(!('email' in regResult.profile), 'Email is strictly isolated from public profile object');

  // Journey 3: Log in
  console.log('\n--- Journey 3: Log in with credentials ---');
  const loginResult = await supabaseApi.signIn({
    email: regEmail,
    password: regPassword,
  });
  assert(loginResult.user && loginResult.profile, 'Sign in returns authenticated user and profile');

  // Journey 4: Publish a text-only experience
  console.log('\n--- Journey 4: Publish text-only experience ---');
  const textExp = await supabaseApi.createExperience({
    userId: loginResult.user.id,
    authorNickname: loginResult.profile.nickname,
    authorAvatar: loginResult.profile.avatar,
    title: 'A momentary stillness on a crowded bridge',
    textContent: 'The wind smelled faintly of winter rain. Everyone moved quickly, but the river underneath moved slower than all of us.',
    experienceType: 'text_only',
  });
  assert(textExp.id && textExp.status === 'published', 'Text experience created with published status');
  assert(textExp.experience_type === 'text_only', 'Experience type recorded as text_only');

  // Journey 5: Publish a photo-only experience
  console.log('\n--- Journey 5: Publish photo-only experience ---');
  const photoExp = await supabaseApi.createExperience({
    userId: loginResult.user.id,
    authorNickname: loginResult.profile.nickname,
    authorAvatar: loginResult.profile.avatar,
    title: null,
    textContent: null,
    experienceType: 'photo_only',
    imageFile: new File(['fake-image-bytes'], 'dawn-over-pines.jpg', { type: 'image/jpeg' }),
    imageCaption: null, // Captions are optional!
  });
  assert(photoExp.id && photoExp.experience_type === 'photo_only', 'Photo-only experience created without caption');
  assert(photoExp.image && photoExp.image.image_url, 'Image record created with URL');

  // Journey 6: Publish a photograph with optional text
  console.log('\n--- Journey 6: Publish photograph with optional text ---');
  const textPhotoExp = await supabaseApi.createExperience({
    userId: loginResult.user.id,
    authorNickname: loginResult.profile.nickname,
    authorAvatar: loginResult.profile.avatar,
    title: 'Rain on the station awning',
    textContent: 'Waiting thirty minutes for the next connection was the quietest part of the month.',
    experienceType: 'text_and_photo',
    imageFile: new File(['fake-image-bytes-2'], 'train-rain.jpg', { type: 'image/jpeg' }),
    imageCaption: 'Droplets collecting in the amber streetlamp light',
  });
  assert(textPhotoExp.id && textPhotoExp.experience_type === 'text_and_photo', 'Text & photo experience successfully created');
  assert(textPhotoExp.image.caption !== null, 'Optional caption safely stored');

  // Journey 7: Discover published experiences
  console.log('\n--- Journey 7: Discover published experiences ---');
  const discoverFeed = await supabaseApi.getDiscoverExperiences();
  assert(discoverFeed.length >= 3, 'Discovery feed returns published experiences');
  const foundTextExp = discoverFeed.find(e => e.id === textExp.id);
  assert(foundTextExp !== undefined, 'Newly published text experience appears in discovery');
  assert(foundTextExp.author_nickname === regNickname, 'Experience author nickname is correct in feed');

  // Journey 8: Open an experience
  console.log('\n--- Journey 8: Open an experience for full view ---');
  assert(foundTextExp.text_content && foundTextExp.text_content.length > 0, 'Full prose content is available when opening');

  // Journey 9: View personal submissions
  console.log('\n--- Journey 9: View personal submissions ---');
  const mySubmissions = await supabaseApi.getMySubmissions(loginResult.user.id);
  assert(mySubmissions.length >= 3, 'User can view all 3 of their own submissions');
  assert(mySubmissions.some(e => e.experience_type === 'text_only'), 'Identifies text-only submission');
  assert(mySubmissions.some(e => e.experience_type === 'photo_only'), 'Identifies photo-only submission');
  assert(mySubmissions.some(e => e.experience_type === 'text_and_photo'), 'Identifies text-and-photo submission');

  // Journey 10: Delete an owned submission
  console.log('\n--- Journey 10: Delete an owned submission ---');
  const deletedOk = await supabaseApi.deleteExperience(photoExp.id, loginResult.user.id);
  assert(deletedOk === true, 'Owned submission deleted successfully');
  const updatedSubmissions = await supabaseApi.getMySubmissions(loginResult.user.id);
  assert(!updatedSubmissions.some(e => e.id === photoExp.id), 'Deleted submission removed from personal archive');

  // Journey 11: Attempt unauthorized deletion
  console.log('\n--- Journey 11: Attempt unauthorized deletion ---');
  let unauthorizedRejected = false;
  try {
    // Attempt to delete textExp using a DIFFERENT user's ID
    await supabaseApi.deleteExperience(textExp.id, 'intruder-id-999');
  } catch (err) {
    unauthorizedRejected = true;
  }
  assert(unauthorizedRejected === true, 'Unauthorized deletion attempt strictly rejected');

  // Journey 12: Report an experience
  console.log('\n--- Journey 12: Report an experience ---');
  const reportOk = await supabaseApi.submitReport({
    experienceId: textExp.id,
    reportingUserId: 'usr-ordinary-gull',
    reason: 'spam',
    details: 'Testing report submission mechanism',
  });
  assert(reportOk === true, 'Community report submitted successfully');

  // Journey 13: Log in as authorized moderator
  console.log('\n--- Journey 13: Log in as authorized moderator ---');
  const modSession = await supabaseApi.signIn({
    email: 'silent_wanderer@domain.org',
    password: 'any',
  });
  assert(modSession.profile.is_moderator === true, 'Moderator session verified');

  // Journey 14: Review and remove a violating experience
  console.log('\n--- Journey 14: Review and remove violating experience ---');
  const pendingReports = await supabaseApi.getModerationReports();
  const targetReport = pendingReports.find(r => r.experience_id === textExp.id);
  assert(targetReport !== undefined, 'Report appears in moderator queue');

  const modDecisionOk = await supabaseApi.submitModerationDecision({
    reportId: targetReport.id,
    experienceId: textExp.id,
    moderatorUserId: modSession.user.id,
    decision: 'removed',
    notes: 'Removed under sanctuary guideline #4 test',
  });
  assert(modDecisionOk === true, 'Moderator decision recorded');

  // Verify removed experience no longer appears in discovery
  const refreshedFeed = await supabaseApi.getDiscoverExperiences();
  assert(!refreshedFeed.some(e => e.id === textExp.id), 'Removed experience no longer visible in discovery feed');

  // Journey 15: Log out
  console.log('\n--- Journey 15: Log out ---');
  await supabaseApi.signOut();
  assert(supabaseApi.getCurrentSession() === null, 'User session cleared on logout');

  // Journey 16: Request account deletion
  console.log('\n--- Journey 16: Request account deletion ---');
  const delReq = await supabaseApi.requestAccountDeletion(loginResult.user.id, 'Moving on from digital spaces');
  assert(delReq.id && delReq.status === 'pending', 'Account deletion request logged as pending without false permanent wipeout claims');

  console.log('\n======================================================');
  console.log(`ALL TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
