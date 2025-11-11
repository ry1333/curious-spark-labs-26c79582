# RMXR MVP Roadmap
**Social-First Music Creation Platform**

---

## 🎯 **The Vision**
"TikTok for music creation - make 30-second mixes, post to feed, remix others, learn while you create"

---

## 📊 **Current Status**

### ✅ **Completed (85% of MVP)**
- [x] Authentication (sign up/sign in)
- [x] Database (posts, reactions, profiles tables)
- [x] DJ Studio (2-deck mixer with EQ, filters, crossfader)
- [x] Recording functionality
- [x] Publishing to Supabase
- [x] File upload (audio + video with audio extraction)
- [x] Stream/Feed page structure
- [x] Profile pages
- [x] Onboarding flow

### ⏳ **In Progress**
- [ ] Fix: Load audio files in DJ Studio
- [ ] Fix: Onboarding profile data not saving

### ❌ **Missing for MVP**
- [ ] Owned loop pack (3-5 starter loops)
- [ ] Stream feed showing posts
- [ ] Reactions (like/save/share buttons)
- [ ] Remix functionality
- [ ] Basic user profiles with posts

---

## 🚀 **MVP Launch Checklist (Next 7 Days)**

### **Day 1-2: Core Functionality** ✅
**Goal:** DJ Studio works end-to-end

- [x] Fix demo button with error handling
- [ ] Test: Upload MP3 → Play → Mix → Record → Publish
- [ ] Verify: Post appears in database
- [ ] Fix: Any playback issues

**Success Metric:** Can create and publish a 30s mix

---

### **Day 3-4: Content & Feed** 📱
**Goal:** Users can discover content

**A. Create Starter Loop Pack**
- [ ] Source/create 3-5 royalty-free loops
  - 1x House loop (124 BPM)
  - 1x Hip-Hop loop (90 BPM)
  - 1x EDM loop (128 BPM)
  - 1x Lo-Fi loop (80 BPM)
  - 1x Techno loop (130 BPM)
- [ ] Upload to `/public/loops/`
- [ ] Update DJ Studio to show library
- [ ] Add "Browse Loops" button

**B. Build Feed Functionality**
- [ ] Query posts from Supabase in Stream.tsx
- [ ] Display posts with audio player
- [ ] Show user info (from profiles table)
- [ ] Add loading states
- [ ] Handle empty state ("No posts yet")

**Success Metric:** Feed shows published posts with playback

---

### **Day 5: Social Features** 💙
**Goal:** Basic engagement works

- [ ] Implement Like button (insert to reactions table)
- [ ] Show like count on posts
- [ ] Add Save functionality
- [ ] Add Share button (copy link)
- [ ] Real-time reaction counts

**Success Metric:** Can like/save posts, counts update

---

### **Day 6: Polish & Testing** 🎨
**Goal:** MVP feels complete

**A. User Experience**
- [ ] Mobile responsive (especially DJ Studio)
- [ ] Loading states everywhere
- [ ] Error messages are helpful
- [ ] Empty states guide users
- [ ] "Getting Started" banner on DJ page

**B. Profile Pages**
- [ ] Show user's published posts
- [ ] Display stats (posts, likes)
- [ ] Edit profile (display name, bio)

**C. End-to-End Test**
- [ ] New user signup
- [ ] Complete onboarding
- [ ] Load loop from library
- [ ] Create 30s mix
- [ ] Publish to feed
- [ ] View in Stream
- [ ] Like/save another post
- [ ] Check profile

**Success Metric:** Smooth experience from signup → publish → discover

---

### **Day 7: Launch Prep** 🚢
**Goal:** Ready for first users

- [ ] Deploy to production (Lovable publish)
- [ ] Test on mobile devices
- [ ] Create demo video (30s mix creation)
- [ ] Write launch post
- [ ] Invite 5-10 beta testers
- [ ] Monitor for errors

**Success Metric:** Live site, 5+ test users create posts

---

## 🎵 **Loop Pack Strategy**

### **Phase 1: MVP Launch (Free)**
5 starter loops (different genres/BPMs)
- Clear licensing
- High quality
- Instant mixing ready

### **Phase 2: Post-Launch (+2 weeks)**
- 10 more loops (expand genres)
- User-requested styles
- Collaboration loops (layerable)

### **Phase 3: Monetization (+1 month)**
- Premium pack #1 (10 loops) - $4.99
- Weekly challenge pack
- Sponsored pack (label partnership)

---

## 📈 **Success Metrics (First 30 Days)**

### **Usage Metrics:**
- 50+ signups
- 100+ posts created
- 500+ feed views
- 200+ reactions (likes/saves)
- 20% weekly return rate

### **Quality Metrics:**
- <5% error rate
- <3s page load time
- 80% mobile traffic
- 70% completion rate (signup → first post)

### **Engagement Metrics:**
- 3+ posts per active user
- 40% of users like content
- 10% of users save content
- 20% share externally

---

## 🔧 **Technical Debt to Address**

### **Critical (Block MVP):**
- [ ] Onboarding profile data save fix
- [ ] Audio playback reliability
- [ ] Mobile layout issues

### **Important (Fix Soon):**
- [ ] Audio file size limits
- [ ] Loading performance
- [ ] Error handling throughout
- [ ] Session persistence

### **Nice to Have (Post-MVP):**
- [ ] Video export with visualizer
- [ ] Offline mode
- [ ] Progressive Web App
- [ ] Push notifications

---

## 🎬 **Post-MVP Features (Prioritized)**

### **Week 2-3: Remix & Challenges**
- [ ] "Remix this" button on posts
- [ ] Load post audio into DJ Studio
- [ ] Parent post attribution
- [ ] First manual challenge (admin posted)
- [ ] Challenge submissions view

### **Week 4-5: Social Graph**
- [ ] Follow/unfollow users
- [ ] Following feed (vs global)
- [ ] Notifications (likes, remixes, follows)
- [ ] Comments on posts

### **Week 6-8: AI & Templates**
- [ ] 30s clip templates (pre-defined mixes)
- [ ] AI beatmatching suggestions
- [ ] Auto-mix generator
- [ ] Micro-learning tips

### **Month 3: Monetization**
- [ ] Pro tier features
- [ ] Premium loop packs
- [ ] Sponsored challenges
- [ ] Creator payouts

---

## 🚨 **Risk Register**

### **High Priority Risks:**

**1. User Can't Create First Mix**
- Mitigation: Excellent onboarding, instant loops, templates
- Status: In progress (adding loop library)

**2. Feed is Empty (Cold Start)**
- Mitigation: Seed with demo posts, invite creators early
- Status: Planned (create 10 demo posts)

**3. Mobile Experience Broken**
- Mitigation: Test on devices, responsive design
- Status: Needs testing

**4. Audio Quality Issues**
- Mitigation: Proper encoding, file size limits, format support
- Status: Monitor after launch

### **Medium Priority Risks:**

**5. Copyright Claims**
- Mitigation: Own all loops, clear licensing
- Status: Handled (owned content only)

**6. Server Costs**
- Mitigation: Supabase free tier, optimize storage
- Status: Monitor usage

**7. Spam/Low Quality Content**
- Mitigation: Report button, moderation queue
- Status: Post-launch feature

---

## 💰 **Budget & Resources**

### **Required for MVP:**
- Supabase (Free tier) - $0
- Domain (if custom) - $12/year
- Loop pack creation/licensing - $0-200
- Testing devices - Use personal
- **Total: $0-212**

### **Post-Launch (Monthly):**
- Hosting (Supabase Pro) - $25/month
- Storage (if needed) - $10/month
- Loop commissions - Variable
- **Est: $35-100/month**

---

## 📞 **Support Plan**

### **MVP Phase:**
- Email: support@rmxr.app (set up)
- In-app: "Help" button → email
- Discord: Beta tester community
- Response time: <24 hours

### **Post-Launch:**
- FAQ page
- Tutorial videos
- Community Discord
- Bug reporting form

---

## 🎯 **Definition of Done (MVP)**

**RMXR MVP is "done" when:**

1. ✅ New user can sign up in <2 minutes
2. ✅ User can create 30s mix with loops in <5 minutes
3. ✅ Mix publishes to feed successfully
4. ✅ Feed loads and plays posts
5. ✅ User can like/save posts
6. ✅ Profile shows user's posts
7. ✅ Mobile experience works
8. ✅ No critical bugs
9. ✅ 5 beta testers complete full flow
10. ✅ Deployed to production

**Then: Launch to public! 🚀**

---

## 📅 **Timeline Summary**

```
Week 1: Core functionality + loop library + feed
Week 2: Social features + polish + testing
Week 3: Beta testing + fixes
Week 4: Public launch 🎉

Post-Launch:
Week 5-6: Remix & challenges
Week 7-8: Social graph
Month 3: AI features
Month 4: Monetization
```

---

## 🤝 **Next Actions (Right Now)**

1. **Test DJ Studio** with real audio files in Lovable
2. **Report any bugs** you find
3. **Decide on loop strategy:**
   - Option A: Find 5 royalty-free loops online
   - Option B: Commission 5 loops from producer
   - Option C: Create simple loops yourself
4. **Prioritize**: Feed or loops first?

---

_Last Updated: 2025-11-11_
_Owner: Ryan + Claude_
_Status: MVP Development_
